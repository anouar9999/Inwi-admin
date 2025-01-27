/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    // TODO: Consider enabling modularizeImports for material when https://github.com/mui/material-ui/issues/36218 is resolved
    // '@mui/material': {
    //   transform: '@mui/material/{{member}}',
    // },
  },
  images: {
    domains: ["placeholder.co","localhost",'t4.ftcdn.net','genius-morocco.com','img.freepik.com','wallpaper.forfun.com','api.dicebear.com','encrypted-tbn0.gstatic.com','play-lh.googleusercontent.com',"yt3.googleusercontent.com","pbs.twimg.com","seeklogo.com","designzonic.com","via.placeholder.com","images.unsplash.com","upload.wikimedia.org"],

  },
  
}

module.exports = nextConfig
