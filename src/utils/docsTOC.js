import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Single source of truth for docs TOC generation
export function generateTOC() {
  const docsDir = path.join(process.cwd(), 'src/pages/docs');
  const sections = [];
  
  try {
    const entries = fs.readdirSync(docsDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderPath = path.join(docsDir, entry.name);
        const tocPath = path.join(folderPath, '_toc.md');
        
        if (fs.existsSync(tocPath)) {
          const tocContent = fs.readFileSync(tocPath, 'utf8');
          const { data: tocData } = matter(tocContent);
          
          const pages = (tocData.pages || [])
            .map(page => ({
              ...page,
              route: `/docs/${entry.name}/${page.file}`
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          
          sections.push({
            title: tocData.title,
            order: tocData.order || 0,
            pages
          });
        }
      }
    }
    
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error generating TOC:', error);
    return [];
  }
}

// Generate cards data from markdown files in subfolders
export function getDocsCards() {
  const docsDir = path.join(process.cwd(), 'src/pages/docs');
  const cards = [];
  
  try {
    const entries = fs.readdirSync(docsDir, { withFileTypes: true });
    
    // Scan subfolders
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderPath = path.join(docsDir, entry.name);
        const files = fs.readdirSync(folderPath);
        
        for (const file of files) {
          if (file.endsWith('.md') && !file.startsWith('_')) {
            const filePath = path.join(folderPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter } = matter(fileContent);
            
            if (frontmatter.card) {
              const route = `/docs/${entry.name}/${file.replace('.md', '')}`;
              cards.push({
                ...frontmatter.card,
                route
              });
            }
          }
        }
      }
    }
    
    // Sort by order
    return cards.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error reading docs cards:', error);
    return [];
  }
}