import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories, articles, getArticlesByCategory, type Article } from '@/stores/encyclopediaData';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function Encyclopedia() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categoryArticles = getArticlesByCategory(selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">股票小百科</h1>
          <p className="text-muted-foreground mt-1">从入门到进阶的股票知识库</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">知识分类</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedArticle(null);
                      }}
                    >
                      {category}
                      <span className="ml-auto text-xs opacity-60">
                        {getArticlesByCategory(category).length}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles List & Content */}
          <div className="lg:col-span-3">
            {selectedArticle ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {selectedArticle.category}
                      </div>
                      <CardTitle>{selectedArticle.title}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedArticle(null)}
                    >
                      返回列表
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[60vh]">
                    <div className="prose prose-sm max-w-none">
                      {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h3 key={idx} className="font-semibold text-lg mt-6 mb-3">
                              {paragraph.replace(/\*\*/g, '')}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                          return (
                            <ul key={idx} className="list-disc pl-5 my-3 space-y-1">
                              {items.map((item, i) => (
                                <li key={i} className="text-foreground/90">
                                  {item.replace('- ', '')}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (paragraph.match(/^\d\./)) {
                          const items = paragraph.split('\n').filter(line => line.match(/^\d\./));
                          return (
                            <ol key={idx} className="list-decimal pl-5 my-3 space-y-1">
                              {items.map((item, i) => (
                                <li key={i} className="text-foreground/90">
                                  {item.replace(/^\d\.\s*/, '')}
                                </li>
                              ))}
                            </ol>
                          );
                        }
                        return (
                          <p key={idx} className="text-foreground/90 leading-relaxed my-3">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedCategory}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({categoryArticles.length} 篇文章)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryArticles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {article.content.slice(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
