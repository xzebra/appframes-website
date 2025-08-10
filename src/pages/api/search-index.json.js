import fs from 'fs';
import path from 'path';

// This endpoint generates a search index from actual markdown files at build time
export async function GET() {
  const docs = [];
  const docsDir = path.join(process.cwd(), 'src/pages/docs');
  
  try {
    // Recursively scan docs directory for .astro and .md files
    function scanDirectory(dir, baseRoute = '/docs') {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(filePath, `${baseRoute}/${file}`);
        } else if (file.endsWith('.astro') || file.endsWith('.md')) {
          const content = fs.readFileSync(filePath, 'utf8');
          const route = file === 'index.astro' || file === 'index.md' 
            ? baseRoute 
            : `${baseRoute}/${file.replace(/\.(astro|md)$/, '')}`;
          
          // Extract frontmatter and content
          const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
          const bodyContent = content.replace(/^---\s*\n[\s\S]*?\n---/, '').trim();
          
          let title = file.replace(/\.(astro|md)$/, '');
          let description = '';
          
          if (frontmatterMatch) {
            // Try to extract title from frontmatter or Layout title
            const titleMatch = content.match(/title[:\s]*["']([^"']+)["']/i);
            if (titleMatch) {
              title = titleMatch[1];
            }
          }
          
          // Extract title from h1 tags
          const h1Match = bodyContent.match(/<h1[^>]*>(.*?)<\/h1>/);
          if (h1Match) {
            title = h1Match[1].replace(/<[^>]+>/g, '').trim();
          }
          
          // Extract description from first paragraph after h1
          const afterH1 = bodyContent.replace(/<h1[^>]*>.*?<\/h1>/, '');
          const paragraphMatch = afterH1.match(/<p[^>]*>(.*?)<\/p>/);
          if (paragraphMatch) {
            description = paragraphMatch[1]
              .replace(/<[^>]+>/g, '') // Remove HTML tags
              .trim()
              .substring(0, 150); // Limit length
          }
          
          // If no description found, try to get it from plain text
          if (!description) {
            const plainText = bodyContent
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            const sentences = plainText.split('.').filter(s => s.length > 20);
            if (sentences.length > 0) {
              description = sentences[0].substring(0, 150) + (sentences[0].length > 150 ? '...' : '');
            }
          }
          
          // Create searchable content by extracting text
          const searchableContent = bodyContent
            .replace(/<[^>]+>/g, ' ') // Remove HTML tags
            .replace(/[^\w\s]/g, ' ') // Remove special characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .toLowerCase()
            .substring(0, 500); // Limit content length
          
          docs.push({
            title: title || 'Documentation',
            description: description || 'Documentation page',
            route,
            content: `${title} ${description} ${searchableContent}`.toLowerCase()
          });
        }
      });
    }
    
    // Scan the docs directory
    if (fs.existsSync(docsDir)) {
      scanDirectory(docsDir);
    }
    
    // Sort by route for consistent ordering
    docs.sort((a, b) => a.route.localeCompare(b.route));
    
  } catch (error) {
    console.error('Error generating search index:', error);
    // Fallback to empty array if there's an error
  }

  return new Response(JSON.stringify(docs), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}