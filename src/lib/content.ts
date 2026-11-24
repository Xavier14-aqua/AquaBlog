export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date).replaceAll('/', '.');
}

export function entryUrl(section: 'projects' | 'journal', id: string): string {
  return `/${section}/${id.split('/').map(encodeURIComponent).join('/')}/`;
}
