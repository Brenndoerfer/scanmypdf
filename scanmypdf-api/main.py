from typing import Optional
import uvicorn
import os
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import ghostscript
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTasks
from google.cloud import storage

storage_client = storage.Client()


app = FastAPI()

origins = [
    "https://scanmypdf.com",
    "https://www.scanmypdf.com",
    # "http://localhost:3000",
    # "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def remove_file(path: str) -> None:
    os.unlink(path)


def upload_blob(source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    bucket_name = "scanmypdf_downloads"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )


MAX_SIZE = 2  # MB
MAX_PAGES = 10  # no of pages


@app.post("/upload")
async def receive_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), radio: str = Form('grayscale')):

    try:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        f = file.filename.replace(' ', '') + str(time.time())

        f_dir = f'{dir_path}/uploads/{f}'
        input_file = f'{dir_path}/uploads/{f}'
        # filename_im = f'{dir_path}/uploads/im_{time.time()}-{file.filename}'.replace('.pdf', '')
        output_pdf = f'{dir_path}/uploads/OUTPUT_{f}.pdf'
        tmp_pdf = f'{dir_path}/uploads/_tmp_{f}.pdf'

        # print(filename, filename_im, filename_pdf)

        f = open(f'{input_file}', 'wb')
        content = await file.read()
        f.write(content)

        if len(content) / 1024 / 1024 > MAX_SIZE:
            remove_file(input_file)
            raise HTTPException(
                status_code=400, detail="PDF cannot be bigger than 10 MB")

        cnt_cmd = f'gs -q -dNODISPLAY -dNOSAFER --permit-file-read="{input_file}" -c "({input_file}) (r) file runpdfbegin pdfpagecount = quit"'
        cnt = os.popen(cnt_cmd).read()

        if int(cnt) > MAX_PAGES:
            remove_file(input_file)
            raise HTTPException(
                status_code=400, detail="PDF cannot be longer than 10 pages")

        # cmd = f"gs -sDEVICE=pngalpha -o {input_file}-%04d.pdf -r144 -f {input_file}"
        # -linear-stretch 3.5%x10%
        cmd = f"convert -density 150 {input_file} -colorspace gray -blur 0x0.5 -attenuate 0.25 +noise Gaussian -rotate 1.0 {input_file}-%04d.png "
        if radio == 'color':
            cmd = f"convert -density 150 {input_file} -blur 0x0.5 -attenuate 0.25 +noise Gaussian -rotate 1.0 {input_file}-%04d.png "
        # cmd = f"magick -density 100 {input_file} {input_file}-%04d.png "
        os.system(cmd)

        # cmd = f'rm {input_file}'
        # os.system(cmd)
        os.unlink(input_file)

        # cmd_pdf = f"convert -density 72 $(ls -rt {input_file}*) -colorspace gray -linear-stretch .1%x3% -blur 0x0.5 -attenuate 0.1 +noise Gaussian -rotate 0.5  -compress Group4 {output_pdf}"
        # cmd_pdf = f"convert $(ls -rt {input_file}*) -colorspace gray -linear-stretch .2%x3% -attenuate 0.5 +noise Gaussian -blur 0x0.5  -rotate 0.5 {output_pdf}"
        cmd_pdf = f"convert $(ls -rt {input_file}*) {tmp_pdf}"
        os.system(cmd_pdf)

        cmd_pdf = f"gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -sColorConversionStrategy=LeaveColorUnchanged -dAutoFilterColorImages=true -dAutoFilterGrayImages=true -dDownsampleMonoImages=true -dDownsampleGrayImages=true -dDownsampleColorImages=true -sOutputFile={output_pdf} {tmp_pdf}"
        if radio == 'color':
            cmd_pdf = f"gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -sOutputFile={output_pdf} {tmp_pdf}"

        os.system(cmd_pdf)
        os.system(f'rm {tmp_pdf}')
        os.system(f'rm {f_dir}*')

        upload_blob(output_pdf, f'SCANNED_{file.filename}')
        background_tasks.add_task(remove_file, output_pdf)
        return FileResponse(
            output_pdf, media_type='application/pdf', filename=f'SCANNED_{file.filename}')

    except Exception as e:
        background_tasks.add_task(remove_file, output_pdf)
        raise HTTPException(
            status_code=400, detail="Oops, butter fingers! Dropped the file (aka something went wrong)")

    # args = b"""test.py
    #     -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -sOutputFile=/tmp/out.pdf
    #     -c .setpdfwrite""".split()

    # gs_cmd = f"""gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -sColorConversionStrategy=LeaveColorUnchanged -dAutoFilterColorImages=true
    #  -dAutoFilterGrayImages=true -dDownsampleMonoImages=true -dDownsampleGrayImages=true -dDownsampleColorImages=true
    #  -sOutputFile={filename_gs} -c .setpdfwrite -f {filename_im}"""

    # gs_cmd = f"gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -sColorConversionStrategy=LeaveColorUnchanged -dAutoFilterColorImages=true -dAutoFilterGrayImages=true -dDownsampleMonoImages=true -dDownsampleGrayImages=true -dDownsampleColorImages=true -sOutputFile={filename_gs} {filename_im}"
    # gs_cmd = f"gs -sDEVICE=pdfwrite -o myFile.pdf {} -c myFile.jpg viewJPEG"
    # print(gs_cmd)

    # os.system(gs_cmd)

    # ghostscript.Ghostscript(*args)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
