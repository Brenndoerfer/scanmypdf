import * as React from 'react';
import Script from 'next/script';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className=''>
      <div className=''>{children}</div>
      <Script
        id='myscript1'
        strategy='afterInteractive'
        src='https://www.googletagmanager.com/gtag/js?id=G-CMHXM2GV5X'
      ></Script>
      <Script id='myscript2'>
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CMHXM2GV5X');
  `}
      </Script>
    </div>
  );
}
