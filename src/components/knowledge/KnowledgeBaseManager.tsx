import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, BookOpen, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Article, KnowledgeBase, SearchResult } from '@/types/knowledge';
import { useAppContext } from '@/contexts/AppContext';

const KnowledgeBaseManager = () => {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('admin');

  const isAdmin = user?.role === 'agency_admin' || user?.role === 'super_admin';

  useEffect(() => {
    loadArticles();
  }, [activeTab]);

  const loadArticles = () => {
    const storageKey = activeTab === 'admin' ? 'rubbl_admin_articles' : 'rubbl_client_articles';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      // Initialize with sample data
      const sampleArticles: Article[] = [
        {
          id: '1',
          title: 'Getting Started Guide',
          content: 'Welcome to the portal...',
          category: 'Getting Started',
          tags: ['guide', 'basics'],
          status: 'published',
          authorId: user?.id || '1',
          authorName: user?.name || 'Admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          isClientVisible: activeTab === 'client',
          viewCount: 0
        }
      ];
      setArticles(sampleArticles);
      localStorage.setItem(storageKey, JSON.stringify(sampleArticles));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = articles
      .filter(article => 
        article.title.toLowerCase().includes(term.toLowerCase()) ||
        article.content.toLowerCase().includes(term.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      )
      .map(article => ({
        article,
        relevanceScore: calculateRelevance(article, term),
        matchedTerms: extractMatchedTerms(article, term)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    setSearchResults(results);
  };

  const calculateRelevance = (article: Article, term: string): number => {
    let score = 0;
    const lowerTerm = term.toLowerCase();
    
    if (article.title.toLowerCase().includes(lowerTerm)) score += 3;
    if (article.content.toLowerCase().includes(lowerTerm)) score += 1;
    article.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerTerm)) score += 2;
    });
    
    return score;
  };

  const extractMatchedTerms = (article: Article, term: string): string[] => {
    const terms = [];
    const lowerTerm = term.toLowerCase();
    
    if (article.title.toLowerCase().includes(lowerTerm)) terms.push('title');
    if (article.content.toLowerCase().includes(lowerTerm)) terms.push('content');
    article.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerTerm)) terms.push(`tag:${tag}`);
    });
    
    return terms;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayArticles = searchTerm ? searchResults.map(r => r.article) : articles;
  const filteredArticles = selectedCategory === 'all' 
    ? displayArticles 
    : displayArticles.filter(article => article.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admin Knowledge Base
            </TabsTrigger>
          )}
          <TabsTrigger value="client" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Client Knowledge Base
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{article.category}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-3 h-3" />
                          {article.viewCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>By {article.authorName}</span>
                    <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseManager;