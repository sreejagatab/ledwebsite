# LuminaTech LED - Professional LED Installation Services Website

A modern, responsive website for an LED installations business built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Sleek, professional design with responsive layouts for all devices
- **Complete Business Website**: Includes Home, About Us, Services, Portfolio, and Contact pages
- **Performance Optimized**: Built with Next.js for optimal performance and SEO
- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Interactive Elements**: Engaging UI components and animations
- **Contact Form**: Functional contact form with validation
- **Portfolio Showcase**: Showcase for LED installation projects

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Ready for deployment on Vercel, Netlify, or any hosting service

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ledwebsite.git
   cd ledwebsite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
ledwebsite/
├── app/                  # Next.js App Router
│   ├── about/            # About Us page
│   ├── contact/          # Contact page
│   ├── portfolio/        # Portfolio page
│   ├── services/         # Services page
│   ├── components/       # Reusable React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── public/               # Static assets
│   └── images/           # Image files
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Customization

### Changing Content

- Edit the text content in the respective page files (`app/page.tsx`, `app/about/page.tsx`, etc.)
- Update images by replacing files in the `public/images/` directory

### Styling

- Global styles are in `app/globals.css`
- The website uses Tailwind CSS for styling - refer to the [Tailwind documentation](https://tailwindcss.com/docs) for customization options

### Adding New Pages

1. Create a new directory in the `app/` folder
2. Add a `page.tsx` file with your page content

## Deployment

This website can be easily deployed to various hosting platforms:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images: Replace placeholder images with your own or properly licensed images
- Icons: Heroicons (included with Tailwind CSS)
- Fonts: Inter and Poppins from Google Fonts
