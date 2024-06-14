/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions:true,
    },
    images:{
        domains:["localhost",'jqoglqfgxygvnaphomry.supabase.co'],
    }
}

module.exports = nextConfig
