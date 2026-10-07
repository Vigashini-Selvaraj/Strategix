const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/vigas/Desktop/strategixx';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove inline styles from h1 and h2
    content = content.replace(/<(h[12])([^>]*)style="[^"]*font-size[^"]*"([^>]*)>/gi, '<$1$2$3>');
    content = content.replace(/<(h[12])([^>]*)style="[^"]*color[^"]*"([^>]*)>/gi, '<$1$2$3>');
    content = content.replace(/<h[12] [^>]*style=""[^>]*>/gi, (match) => match.replace(' style=""', ''));

    // Fix inner spans that have inline color: var(--gold)
    content = content.replace(/<span[^>]*style="[^"]*color:\s*var\(--gold\)[^"]*"[^>]*>(.*?)<\/span>/gi, '<span class="text-gold">$1</span>');
    content = content.replace(/<span([^>]*)style=""([^>]*)>/gi, '<span$1$2>');

    // Find all h2s that match the section heading pattern and ensure dual color
    content = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, innerHtml) => {
        // If it already has a text-gold span or is empty/small, leave it alone if it's already structured well
        if (innerHtml.includes('class="text-gold"')) {
            return match;
        }

        // If it has an existing span without text-gold, add it
        if (innerHtml.includes('<span')) {
            let updatedInner = innerHtml.replace(/<span([^>]*)>/i, '<span class="text-gold"$1>');
            return `<h2${attrs}>${updatedInner}</h2>`;
        }

        // Split text roughly in half by words
        const text = innerHtml.replace(/<br\s*\/?>/gi, ' ').trim();
        const words = text.split(/\s+/);
        if (words.length > 1) {
            const mid = Math.floor(words.length / 2);
            const firstHalf = words.slice(0, mid).join(' ');
            const secondHalf = words.slice(mid).join(' ');
            
            // Reconstruct with original br if possible, but simplest is just wrapping second half
            // Let's just wrap second half
            return `<h2${attrs}>${firstHalf} <span class="text-gold">${secondHalf}</span></h2>`;
        }

        return match;
    });

    // Clean up any double text-gold classes
    content = content.replace(/class="text-gold"\s+class="text-gold"/gi, 'class="text-gold"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
});
