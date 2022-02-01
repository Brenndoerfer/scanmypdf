import axios from 'axios';
import { useRef, useState } from 'react';

import 'react-dropzone-uploader/dist/styles.css';

import Seo from '@/components/Seo';

import Navigation from '../components/layout/Navigation';

import classnames from 'classnames';
import classNames from 'classnames';

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

export default function APIPage() {
  return (
    <>
      <Navigation />
      <Seo templateTitle='API' />
      <main className=' mx-auto mt-8 max-w-7xl p-8 lg:mt-16'>
        <section className='mb-8'>
          <h1>ScanMyPDF API Access and additional features</h1>
          <p className='mt-8 mb-4'>
            <a
              href='mailto:m.brenndoerfer@outlook.com'
              className='text-blue-500 underline'
            >
              Please reach out
            </a>{' '}
            if you need any of the below:
          </p>
          <ul className='list-disc'>
            <li>API access</li>
            <li>Higher upload limit (more MB)</li>
            <li>Longer PDFs (more pages)</li>
            <li>Random looking scans</li>
            <li>Fine grained control over quality, distortion, noise, etc.</li>
            <li>Anything else</li>
          </ul>
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
