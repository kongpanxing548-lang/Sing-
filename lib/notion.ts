import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const DATABASE_ID = process.env.NOTION_JOURNAL_DATABASE_ID

export interface JournalPost {
  id: string
  title: string
  date: string
  content: string
  tags: string[]
  excerpt: string
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  if (!DATABASE_ID) return []
  
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [
      { property: 'Date', direction: 'descending' },
    ],
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Title?.title?.[0]?.plain_text || '',
    date: page.properties.Date?.date?.start || '',
    content: page.properties.Content?.rich_text?.[0]?.plain_text || '',
    tags: page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
    excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
  }))
}

export async function getJournalPost(id: string): Promise<JournalPost | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id })
    const page = response as any
    return {
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      date: page.properties.Date?.date?.start || '',
      content: page.properties.Content?.rich_text?.[0]?.plain_text || '',
      tags: page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
    }
  } catch {
    return null
  }
}
