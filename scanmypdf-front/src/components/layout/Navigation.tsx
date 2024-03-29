/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Scan my PDF', href: '/' },
  { name: 'Free API access', href: '/api-access' },
  // { name: 'Docs', href: '#' },
  // { name: 'Company', href: '#' },
];

export default function Example() {
  return (
    <header className='bg-blue-600'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' aria-label='Top'>
        <div className='flex hidden w-full items-center justify-between border-b border-blue-600 py-6 lg:block lg:border-none'>
          <div className='flex items-center'>
            <a href='https://scanmypdf.com'>
              <span className='sr-only'>ScanMyPdf</span>
              <img className='h-10 w-auto' src='./images/pdf-icon.png' alt='' />
            </a>
            <div className='ml-10 hidden space-x-8 lg:block'>
              {navigation.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='text-base font-medium text-white hover:text-indigo-50'
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          {/* <div className='ml-10 space-x-4'>
            <a
              href='#'
              className='inline-block rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75'
            >
              Sign in
            </a>
            <a
              href='#'
              className='inline-block rounded-md border border-transparent bg-white py-2 px-4 text-base font-medium text-indigo-600 hover:bg-indigo-50'
            >
              Sign up
            </a>
          </div> */}
        </div>
        <div className='flex flex-wrap justify-center space-x-6 py-4 lg:hidden'>
          <a href='https://scanmypdf.com'>
            <span className='sr-only'>ScanMyPdf</span>
            <img className='h-6 w-auto' src='./images/pdf-icon.png' alt='' />
          </a>
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className='text-base font-medium text-white hover:text-indigo-50'
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
