# 
FROM python:3.9

RUN apt update -y
RUN apt install imagemagick -y
RUN apt install ghostscript -y

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r requirements.txt
# RUN pip install -r requirements.txt
# RUN pip install ghostscript
RUN sed -i '/disable ghostscript format types/,+6d' /etc/ImageMagick-6/policy.xml

# 
COPY . /code/app

# 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
