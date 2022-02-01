import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import 'react-dropzone-uploader/dist/styles.css';

import Seo from '@/components/Seo';

import Navigation from '../components/layout/Navigation';

import classNames from 'classnames';
import Image from 'next/image';

import before from '../../public/images/before.jpg';
import after from '../../public/images/after.jpg';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const [selectedRadio, setRadio] = useState<string>('grayscale');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const ref = useRef();
  const [dots, setDots] = useState<string>('');

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
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((d) => {
          if (d.length > 3) {
            return (d = '');
          } else {
            return (d += '.');
          }
        });
      }, 300);
      return () => clearInterval(interval);
    }, []);

    const [selectedFile, setFile] = useState<File | null>(null);

    const onFileUpload = () => {
      // Update the formData object
      if (!selectedFile) {
        return alert('Please select a file');
      }

      if (selectedFile.size / 1024 / 1024 > 10) {
        return alert('Maximum file size is 10 MB');
      }

      if (selectedFile) {
        setInProgress(true);
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('radio', selectedRadio);

        // Details of the uploaded file

        // Request made to the backend api
        // Send formData object
        axios({
          method: 'POST',
          url: process.env.NEXT_PUBLIC_FILE_API,
          data: formData,
          headers: { 'Content-type': 'multipart/form-data' },
          responseType: 'blob',
        })
          .then((res) => {
            // return res.blob();
            // console.log(res);

            // return res.data.blob();
            return new Blob([res.data], {
              type: 'application/pdf',
            });
          })
          .then((blob) => {
            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'scanned_document.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((err) => {
            // alert('Something went wrong.');
            // console.error(err)
            if (err) return err?.response?.data.text();
          })
          .then((res) => {
            if (res) {
              console.log(res);
              alert(JSON.parse(res).detail);
            }
          })
          .finally(() => {
            ref.current.value = '';
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
          <div className='color-white mx-auto mt-4 rounded-sm bg-blue-200 p-4 text-left text-sm text-black md:w-1/2'>
            <b>NO DATA IS STORED</b>: All documents are processed and
            immediately deleted
          </div>
          <p></p>
        </section>
        {FileUploader()}

        {inProgress ? (
          <>
            <span className='mt-4 rounded-lg border border-dotted bg-gray-50 p-4 text-sm shadow-md'>
              Processing can take 10-30 seconds {dots}
            </span>
          </>
        ) : (
          ''
        )}
        <section className='mt-8'>
          <h2>Why do I need ScanMyPDF.com?</h2>
          <p className='mx-auto mt-4 md:w-2/3'>
            Some old-school institutions might demand you to print out a PDF and
            then to scan it back in before submitting. No need to waste ink and
            paper. We can help. Or you you might simply prefer the look of a
            scanned document 🤷
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
