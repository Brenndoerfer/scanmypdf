// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import im from 'imagemagick';
import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const file = `/Users/michael/projects/scanmypdf/src/pages/api/test2.jpg`
  const file_out = `/Users/michael/projects/scanmypdf/src/pages/api/_test2.jpg`
  const out_pdf = `/Users/michael/projects/scanmypdf/src/pages/api/_test2.jpg`
  // im.identify(file, function (err, features) {
  //   if (err) throw err;
  //   console.log(features);
  //   // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
  //   res.status(200).json({ name: 'Bambang' });
  // });
  im.convert([file, "-density", "150", "-colorspace", "gray", "-linear-stretch",
    "3.5%x10%", "-blur", "0x0.5", "-attenuate", "0.25", "+noise", "Gaussian", "-rotate", "1.0",
    file_out],
    function (err, stdout) {
      if (err) throw err;
      console.log('stdout:', stdout);

    });

  // execSync(`gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE -sDEVICE=pdfwrite -sColorConversionStrategy=LeaveColorUnchanged -dAutoFilterColorImages=true -dAutoFilterGrayImages=true 
  // -dDownsampleMonoImages=true -dDownsampleGrayImages=true -dDownsampleColorImages=true -sOutputFile="${out_pdf}" "${file_out}"`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.log(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // })

  // im.convert([`test.pdf`
  //   , "-density", "150", "-colorspace", "gray", "-linear-stretch",
  //   "3.5%x10%", "-blur", "0x0.5", "-attenuate", "0.25", "+noise", "Gaussian", "-rotate", "1.0",
  //   `test_out.jpg`],

  //   function (err, stdout) {
  //     if (err) throw err;
  //     console.log('stdout:', stdout);
  //     res.status(200).json({ name: 'Bambang' });

  //   });

}
