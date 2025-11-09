# WORK IN PROGRESS
## this is dummy readme.md, ai generated. 

## Chef Portfolio Website

A modern, responsive portfolio website for showcasing culinary creations with a beautiful carousel interface.

## 📁 Project Structure

```
wakeupbowl
├── index.html          # Main portfolio page
├── admin.html          # Admin panel (Work in Progress)
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── data.json           # Content data
└── img/                # Images folder
    └── (your images here)
```

## 🚀 Getting Started

### 1. Clone or Download
Copy all files to your local directory or GitHub repository.

### 2. Add Your Images
Place all your dish images in the `img/` folder. Follow this naming convention:
```
dishname_timestamp.jpg
Example: butter_chicken_1699123456.jpg
```

### 3. Update data.json
Edit `data.json` with your actual content:

```json
{
  "chef": {
    "name": "Your Name",
    "tagline": "Your Tagline",
    "bio": "Your bio...",
    "profileImage": "img/your_profile.jpg",
    "contact": {
      "phone": "+91XXXXXXXXXX",
      "email": "your@email.com",
      "whatsapp": "+91XXXXXXXXXX"
    }
  },
  "cuisines": [
    {
      "id": "italian",
      "name": "Italian",
      "order": 1,
      "dishes": [
        {
          "name": "Dish Name",
          "image": "img/dish_name_timestamp.jpg",
          "shortDescription": "Brief description for card",
          "fullDescription": "Detailed description for modal",
          "tags": ["tag1", "tag2", "tag3"]
        }
      ]
    }
  ]
}
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"


## 🎨 Features

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection + manual toggle
- **Horizontal Carousel**: Smooth scrolling through dishes per cuisine
- **Modal View**: Click any dish to see full details
- **Easy Updates**: Just edit `data.json` and push to GitHub

## 🔧 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --accent-light: #D97757;  /* Change accent color */
    --bg-light: #FAF8F5;      /* Change background */
    /* ... */
}
```

### Adding New Cuisines
Add a new object to the `cuisines` array in `data.json`:
```json
{
  "id": "mexican",
  "name": "Mexican",
  "order": 4,
  "dishes": [...]
}
```

### Adding New Dishes
Add a new object to the `dishes` array under any cuisine:
```json
{
  "name": "New Dish",
  "image": "img/new_dish_1699123456.jpg",
  "shortDescription": "Brief description",
  "fullDescription": "Detailed description",
  "tags": ["tag1", "tag2"]
}
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Update Workflow

1. Edit `data.json` or add images to `img/`
2. Commit and push to GitHub
3. Vercel automatically deploys changes
4. Live in 30-60 seconds!

## 📝 Notes

- **Images**: Currently using Unsplash URLs for demo. Replace with your actual images in `img/` folder
- **Admin Panel**: `/admin.html` is a placeholder for future CMS functionality
- **No Build Process**: Pure HTML/CSS/JS - no npm, no build tools needed
- **Performance**: Images load lazily for better performance

## 🐛 Troubleshooting

**Images not loading?**
- Check image paths in `data.json` match actual filenames
- Ensure images are in the `img/` folder

**Carousel not working?**
- Check browser console for errors
- Ensure `script.js` is loading properly

**Theme not saving?**
- Check browser localStorage is enabled
- Try clearing browser cache

## 📄 License

Free to use for personal and commercial projects.

---

**Need help?** Check the code comments or open an issue on GitHub.
