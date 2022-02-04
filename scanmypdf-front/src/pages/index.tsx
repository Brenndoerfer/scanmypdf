import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import 'react-dropzone-uploader/dist/styles.css';

import Seo from '@/components/Seo';

import Navigation from '../components/layout/Navigation';

import classNames from 'classnames';
import Link from 'next/link';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F

export default function HomePage() {
  const [selectedRadio, setRadio] = useState<string>('grayscale');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const ref = useRef();
  const [dots, setDots] = useState<string>('');

  //   console.log('Using: ', process.env.NEXT_PUBLIC_FILE_API);

  const uploadOptions = () => {
    return (
      <div className='mt-4 text-left '>
        <div className='flex space-x-2'>
          <div className='form-check my-2'>
            <input
              className='form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none'
              type='radio'
              name='grayscaleColor'
              id='grayscale'
              onChange={() => setRadio('grayscale')}
              defaultChecked
            />
            <label
              className='form-check-label inline-block text-gray-800'
              htmlFor='grayscale'
            >
              Grayscale
            </label>
          </div>
          <div className='form-check  my-2'>
            <input
              className='form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none'
              type='radio'
              name='grayscaleColor'
              id='color'
              onChange={() => setRadio('color')}
            />
            <label
              className='form-check-label inline-block text-gray-800'
              htmlFor='color'
            >
              Color
            </label>
          </div>
        </div>
      </div>
    );
  };

  const FileUploader = () => {
    const [selectedFile, setFile] = useState<File | null>(null);

    const onFileUpload = () => {
      // Update the formData object
      if (!selectedFile) {
        return alert('Please select a file');
      }

      const MAX_SIZE = 2;
      if (selectedFile.size / 1024 / 1024 > MAX_SIZE) {
        return alert(`Maximum file size is ${MAX_SIZE} MB`);
      }

      if (selectedFile) {
        setInProgress(true);
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('radio', selectedRadio);
        setUrl('');

        // Details of the uploaded file

        // Request made to the backend api
        // Send formData object
        axios({
          method: 'POST',
          url: process.env.NEXT_PUBLIC_FILE_API,
          data: formData,
          headers: { 'Content-type': 'multipart/form-data' },
          //   responseType: 'application/json',
        })
          .then((res) => {
            if (res?.data?.url) setUrl(res.data.url);
          })
          .catch((err) => {
            if (err?.response?.data?.detail) alert(err.response.data.detail);
          })
          .finally(() => {
            if (ref?.current?.value) ref.current.value = '';
            setFile(null);
            setInProgress(false);
          });
      }
    };

    return (
      <>
        <div className='mx-auto flex w-full'>
          <div className='mx-auto mb-3 w-full md:w-1/2'>
            <label
              htmlFor='formFile'
              className='form-label mb-2 inline-block text-gray-700'
            >
              Select the document
            </label>
            <input
              type='file'
              accept='application/pdf'
              onChange={(e) => setFile(e.target.files[0])}
              ref={ref}
              className='form-control m-0 block
            w-full
            rounded
            border
            border-solid
            border-gray-300
            bg-white bg-clip-padding
            px-3 py-1.5 text-base
            font-normal
            text-gray-700
            transition
            ease-in-out
            focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none'
              id='formFile'
            />
          </div>
        </div>
        {/* <input
        type='file'
        accept='application/pdf'
        onChange={(e) => setFile(e.target.files[0])}
      /> */}
        <button
          type='button'
          onClick={(e) => onFileUpload()}
          data-mdb-ripple='true'
          data-mdb-ripple-color='light'
          className={classNames(
            'inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-blue-400',
            { 'cursor-not-allowed': inProgress }
          )}
          disabled={inProgress ? true : false}
        >
          {inProgress ? (
            <>
              <svg
                className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </button>
        {uploadOptions()}
        <hr />
      </>
    );
  };

  return (
    <>
      <Navigation />
      <Seo templateTitle='Scan' />
      <main className='mx-auto mt-8 flex min-h-screen max-w-7xl flex-col items-center p-4 text-center lg:mt-16'>
        <section className='mb-8'>
          <h1>Make your PDF look like a scanned document</h1>
          <p className='mt-8'>Make your file look as if it was scanned</p>

          {url ? (
            <div
              className={classNames(
                'color-white mx-auto mt-4 rounded-sm  p-4 text-left text-sm text-black md:w-1/2',
                { 'bg-blue-200': url == '', 'bg-green-200': url != '' }
              )}
            >
              <>
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='cursor-pointer text-center text-blue-800 underline'
                  id='downloadLink'
                  href={url}
                  download
                >
                  <b>DOWNLOAD FILE</b> (the file is available for only one day)
                </a>
              </>
            </div>
          ) : (
            ''
          )}
        </section>
        {FileUploader()}

        {inProgress ? (
          <>
            <span className='mt-4 rounded-lg border border-dotted bg-gray-50 p-4 text-sm shadow-md'>
              Please wait - processing usually takes 10-30 seconds
            </span>
          </>
        ) : (
          ''
        )}
        <section className='mt-8'>
          <h2>Why do I need ScanMyPDF.com?</h2>
          <p className='mx-auto mt-4 md:w-2/3'>
            <b>🌲 Save paper and ink.</b> Some old-school institutions might ask
            you to print out a PDF and to then just scan it back in before
            submission, but no worries I got you! (...or you simply prefer the
            look of a scanned document 🤷)
          </p>
          <div className='mt-8 flex justify-center'>
            <div className=''>
              <h2>Before</h2>
              <div className='mt-4 border border-dashed shadow-md'>
                <img src='images/before.jpg' alt='' />
              </div>

              {/* <img
                src='images/before.jpg'
                alt=''
                
              /> */}
            </div>
            <div>
              <h2>After</h2>
              <div className='mt-4 border border-dashed shadow-md'>
                <img src='images/after.jpg' alt='' />
              </div>
            </div>
          </div>
        </section>
        <section className='mt-8 mb-16'>
          <h2>Why does it take 10-30 seconds to process a file?</h2>
          <p className='mx-auto mt-4 '>
            This service is currently running on the cheapest Google Cloud Run
            Instance. Please{' '}
            <Link href='/api-access'>
              <a className='text-blue-500 underline'>reach out</a>
            </Link>{' '}
            if you have specific needs.
          </p>
        </section>
      </main>

      {/* <footer>
        <a
          target='_blank'
          href='https://icons8.com/icon/emjQ5sYXZdXI/pdf'
          rel='noreferrer'
          className='text-xs'
        >
          PDF
        </a>{' '}
        icon by{' '}
        <a target='_blank' href='https://icons8.com' rel='noreferrer'>
          Icons8
        </a>
      </footer> */}
    </>
  );
}
