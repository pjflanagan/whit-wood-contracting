// Load Josefin Sans font into preview pane
CMS.registerPreviewStyle(
  'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap'
);

CMS.registerPreviewStyle(`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: #efe5d8;
    color: #2c2c2c;
    font-family: "Josefin Sans", sans-serif;
    font-weight: 300;
    font-size: 16px;
  }
  h2 {
    font-size: 1.8em;
    font-weight: 700;
    border-bottom: 2px solid #d0a22e;
    padding-bottom: 8px;
    display: inline-block;
    margin: 0 0 24px;
  }
  h3 { font-size: 1.15em; font-weight: 700; margin: 0 0 8px; color: #2c2c2c; }
  p { line-height: 1.7; font-size: 0.96em; margin: 0 0 12px; }
  a { color: #d0a22e; text-decoration: none; }
  strong { font-weight: 600; }
  blockquote { margin: 0; }
  .preview { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
  .card { background: #fbf9f6; border: 1px solid #e0d8cf; }
  .label { font-size: 0.78em; color: #777; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
`, { raw: true });

// ── Services ──────────────────────────────────────────────────────────────────
var ServicesPreview = createClass({
  render: function () {
    var services = this.props.entry.getIn(['data', 'services']);
    var getAsset = this.props.getAsset;
    return h('div', { className: 'preview' },
      h('h2', {}, 'Services'),
      services && services.size > 0
        ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' } },
            services.map(function (svc, i) {
              var images = svc.get('images');
              var firstImage = images && images.size > 0 ? images.get(0) : null;
              var imgSrc = firstImage ? getAsset(firstImage.get ? firstImage.get('image') : firstImage).toString() : null;
              return h('div', { key: i, className: 'card', style: { overflow: 'hidden', position: 'relative', minHeight: imgSrc ? '160px' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
                imgSrc && h('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'url(' + imgSrc + ')', backgroundSize: 'cover', backgroundPosition: 'center' } }),
                h('div', { style: { position: 'relative', padding: '16px', background: imgSrc ? 'linear-gradient(to top, #00000099 60%, transparent)' : 'transparent' } },
                  h('h3', { style: { color: imgSrc ? '#fff' : '#2c2c2c', margin: '0 0 6px' } }, svc.get('title')),
                  h('p', { style: { color: imgSrc ? '#ffffffe9' : '#777', margin: 0 } }, svc.get('description'))
                )
              );
            }).toArray()
          )
        : h('p', { style: { color: '#777' } }, 'No services yet.')
    );
  }
});
CMS.registerPreviewTemplate('services', ServicesPreview);

// ── Testimonials ──────────────────────────────────────────────────────────────
function starsDisplay(rating) {
  var full = Math.floor(rating || 0);
  var empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

var TestimonialsPreview = createClass({
  render: function () {
    var testimonials = this.props.entry.getIn(['data', 'testimonials']);
    return h('div', { className: 'preview' },
      h('h2', {}, 'Testimonials'),
      testimonials && testimonials.size > 0
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
            testimonials.map(function (t, i) {
              return h('div', { key: i, className: 'card', style: { borderLeft: '4px solid #d0a22e', padding: '20px' } },
                h('div', { style: { color: '#d0a22e', fontSize: '1.1em', letterSpacing: '2px' } }, starsDisplay(t.get('rating'))),
                h('blockquote', { style: { fontStyle: 'italic', margin: '12px 0 16px', lineHeight: 1.7, fontSize: '0.95em' } },
                  '"', t.get('quote'), '"'
                ),
                h('footer', { style: { fontSize: '0.88em', color: '#777' } },
                  h('strong', { style: { color: '#2c2c2c' } }, t.get('clientName'))
                )
              );
            }).toArray()
          )
        : h('p', { style: { color: '#777' } }, 'No testimonials yet.')
    );
  }
});
CMS.registerPreviewTemplate('testimonials', TestimonialsPreview);

// ── Portfolio ─────────────────────────────────────────────────────────────────
var PortfolioPreview = createClass({
  render: function () {
    var items = this.props.entry.getIn(['data', 'portfolio']);
    var getAsset = this.props.getAsset;
    return h('div', { className: 'preview' },
      h('h2', {}, 'Portfolio'),
      items && items.size > 0
        ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' } },
            items.map(function (item, i) {
              var photos = item.get('photos');
              var firstPhoto = photos && photos.size > 0 ? photos.get(0) : null;
              var photoSrc = firstPhoto ? getAsset(firstPhoto.get ? firstPhoto.get('photo') : firstPhoto).toString() : null;
              return h('div', { key: i, className: 'card', style: { overflow: 'hidden' } },
                photoSrc
                  ? h('div', { style: { height: '160px', backgroundImage: 'url(' + photoSrc + ')', backgroundSize: 'cover', backgroundPosition: 'center' } })
                  : h('div', { style: { height: '80px', background: '#e0d8cf', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.85em' } }, 'No photo'),
                h('div', { style: { padding: '16px' } },
                  h('h3', {}, item.get('title')),
                  item.get('type') && h('div', { style: { fontSize: '0.8em', color: '#d0a22e', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' } }, item.get('type')),
                  h('p', { style: { color: '#777', margin: 0, fontSize: '0.9em' } }, item.get('description'))
                )
              );
            }).toArray()
          )
        : h('p', { style: { color: '#777' } }, 'No portfolio items yet.')
    );
  }
});
CMS.registerPreviewTemplate('portfolio', PortfolioPreview);

// ── About ─────────────────────────────────────────────────────────────────────
var AboutPreview = createClass({
  render: function () {
    return h('div', { className: 'preview' },
      h('h2', {}, 'About'),
      h('div', {}, this.props.widgetFor('body'))
    );
  }
});
CMS.registerPreviewTemplate('about', AboutPreview);

// ── Sections ──────────────────────────────────────────────────────────────────
var SectionsPreview = createClass({
  render: function () {
    var sections = this.props.entry.getIn(['data', 'sections']);
    return h('div', { className: 'preview' },
      h('h2', {}, 'Page Sections'),
      sections && sections.size > 0
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
            sections.map(function (section, i) {
              return h('div', { key: i, className: 'card', style: { padding: '14px 18px' } },
                h('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: section.get('description') ? '6px' : 0 } },
                  h('code', { style: { background: '#efe5d8', padding: '2px 8px', fontSize: '0.82em', color: '#7c5b05', borderRadius: '2px' } }, section.get('id')),
                  h('strong', {}, section.get('title'))
                ),
                section.get('description') && h('p', { style: { color: '#777', margin: 0, fontSize: '0.88em' } }, section.get('description'))
              );
            }).toArray()
          )
        : h('p', { style: { color: '#777' } }, 'No sections configured.')
    );
  }
});
CMS.registerPreviewTemplate('sections', SectionsPreview);

// ── Site Config ───────────────────────────────────────────────────────────────
var SiteConfigPreview = createClass({
  render: function () {
    var data = this.props.entry.get('data');
    var fields = [
      ['businessName', 'Business Name'],
      ['tagline', 'Tagline'],
      ['phone', 'Phone'],
      ['email', 'Email'],
      ['ctaLabel', 'CTA Button Label'],
      ['seoDescription', 'SEO Description'],
      ['seoKeywords', 'SEO Keywords'],
    ];
    return h('div', { className: 'preview' },
      h('h2', {}, 'Site Configuration'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        fields.map(function (f, i) {
          var value = data.get(f[0]);
          if (!value) return null;
          return h('div', { key: i, className: 'card', style: { padding: '12px 16px' } },
            h('div', { className: 'label' }, f[1]),
            h('div', { style: { fontWeight: 600 } }, value)
          );
        })
      )
    );
  }
});
CMS.registerPreviewTemplate('site_config', SiteConfigPreview);

// ── Social Links ──────────────────────────────────────────────────────────────
var SocialLinksPreview = createClass({
  render: function () {
    var data = this.props.entry.get('data');
    var fields = [
      ['facebookUrl', 'Facebook'],
      ['instagramUrl', 'Instagram'],
      ['houzzUrl', 'Houzz'],
      ['yelpUrl', 'Yelp'],
      ['googleUrl', 'Google'],
    ];
    return h('div', { className: 'preview' },
      h('h2', {}, 'Social Links'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        fields.map(function (f, i) {
          var value = data.get(f[0]);
          if (!value) return null;
          return h('div', { key: i, className: 'card', style: { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' } },
            h('strong', {}, f[1]),
            h('a', { href: value, target: '_blank', style: { fontSize: '0.88em', wordBreak: 'break-all' } }, value)
          );
        })
      )
    );
  }
});
CMS.registerPreviewTemplate('social_links', SocialLinksPreview);

// ── Site Images ───────────────────────────────────────────────────────────────
var SiteImagesPreview = createClass({
  render: function () {
    var data = this.props.entry.get('data');
    var getAsset = this.props.getAsset;
    var fields = [
      ['logoUrl', 'Logo'],
      ['heroImageUrl', 'Hero Image'],
      ['shareCardUrl', 'Share Card (OG Image)'],
    ];
    return h('div', { className: 'preview' },
      h('h2', {}, 'Site Images'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        fields.map(function (f, i) {
          var value = data.get(f[0]);
          if (!value) return null;
          var src = getAsset(value).toString();
          return h('div', { key: i, className: 'card', style: { padding: '16px' } },
            h('div', { className: 'label', style: { marginBottom: '10px' } }, f[1]),
            h('img', { src: src, style: { maxWidth: '100%', maxHeight: '240px', objectFit: 'contain', display: 'block', border: '1px solid #e0d8cf' } })
          );
        })
      )
    );
  }
});
CMS.registerPreviewTemplate('site_images', SiteImagesPreview);
