// // // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// // import { NextApiRequest, NextApiResponse } from 'next';
// // export default function handler(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method === 'POST') {
// //     // Process a POST request
// //   } else {
// //     // Handle any other HTTP method
// //   }
// //   console.log('triggered')
// //   res.status(200).json({ name: 'upload' });
// // }
// import multer from 'multer';
// import nextConnect from 'next-connect';

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//   },
//   // Handle any other HTTP method
//   onNoMatch(req, res) {
//     console.log('Other')
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// const uploadMiddleware = upload.single('file');
// // Adds the middleware to Next-Connect
// apiRoute.use(uploadMiddleware);
// // Process a POST request
// apiRoute.post((req, res) => {
//   // console.log('POST')
//   console.log(req.file)
//   const path = '/Users/michael/projects/scanmypdf/'
//   // im.convert([], function (err, stdout) { return true })
//   // gm.out()
//   im.convert([`${path}/public/uploads/${req.file.filename}`, "-density", "150", "-colorspace", "gray", "-linear-stretch",
//     "3.5%x10%", "-blur", "0x0.5", "-attenuate", "0.25", "+noise", "Gaussian", "-rotate", "1.0",
//   `${path}/public/downloads/_${req.file.filename}`],
//     function (err, stdout) {
//       if (err) throw err;
//       console.log('stdout:', stdout);

//     });

//   res.status(200).json({ data: 'success' });

// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// // https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430