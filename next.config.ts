/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Genera HTML/CSS/JS estáticos compilados
  images: {
    unoptimized: true, // Requerido para exportación estática sin servidor Node
  },
  // Nombre de tu repositorio en GitHub para corregir las rutas de archivos
  basePath: process.env.NODE_ENV === 'production' ? '/flores-amarillas' : '',
};

export default nextConfig;