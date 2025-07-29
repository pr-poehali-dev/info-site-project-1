import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  comments: Comment[];
  likes: number;
  dislikes: number;
  rating: number;
  ratingCount: number;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  likes: number;
  dislikes: number;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [newComment, setNewComment] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [likedNews, setLikedNews] = useState<Set<number>>(new Set());
  const [dislikedNews, setDislikedNews] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set());
  const [userRatings, setUserRatings] = useState<Map<number, number>>(new Map());

  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Новые технологии в образовании",
      description: "Исследование показывает, как ИИ меняет процесс обучения и делает образование более доступным для всех категорий студентов.",
      category: "Технологии",
      date: "29 июля 2025",
      likes: 24,
      dislikes: 3,
      rating: 4.5,
      ratingCount: 18,
      comments: [
        { id: 1, author: "Анна К.", text: "Очень интересная статья! ИИ действительно революционизирует образование.", date: "29 июля 2025", likes: 12, dislikes: 1 },
        { id: 2, author: "Михаил С.", text: "А как насчёт этических вопросов использования ИИ в школах?", date: "29 июля 2025", likes: 8, dislikes: 2 }
      ]
    },
    {
      id: 2,
      title: "Экологические инициативы городов",
      description: "Анализ успешных проектов по озеленению и снижению углеродного следа в крупных городах России и мира.",
      category: "Экология",
      date: "28 июля 2025",
      likes: 31,
      dislikes: 2,
      rating: 4.8,
      ratingCount: 22,
      comments: [
        { id: 3, author: "Елена Р.", text: "Отличные примеры! Нужно больше таких инициатив в нашем городе.", date: "28 июля 2025", likes: 15, dislikes: 0 }
      ]
    },
    {
      id: 3,
      title: "Развитие космических технологий",
      description: "Последние достижения в области космонавтики и планы освоения Марса в ближайшие десятилетия.",
      category: "Космос",
      date: "27 июля 2025",
      likes: 19,
      dislikes: 4,
      rating: 4.2,
      ratingCount: 14,
      comments: []
    }
  ]);

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComment = (newsId: number) => {
    if (newComment.trim()) {
      console.log(`Добавлен комментарий к новости ${newsId}: ${newComment}`);
      setNewComment('');
      setSelectedNewsId(null);
    }
  };

  const handleNewsLike = (newsId: number) => {
    const newLikedNews = new Set(likedNews);
    const newDislikedNews = new Set(dislikedNews);
    
    if (likedNews.has(newsId)) {
      newLikedNews.delete(newsId);
    } else {
      newLikedNews.add(newsId);
      newDislikedNews.delete(newsId);
    }
    
    setLikedNews(newLikedNews);
    setDislikedNews(newDislikedNews);
    
    setNewsItems(items => items.map(item => {
      if (item.id === newsId) {
        let likes = item.likes;
        let dislikes = item.dislikes;
        
        if (newLikedNews.has(newsId) && !likedNews.has(newsId)) {
          likes += 1;
          if (dislikedNews.has(newsId)) dislikes -= 1;
        } else if (!newLikedNews.has(newsId) && likedNews.has(newsId)) {
          likes -= 1;
        }
        
        return { ...item, likes, dislikes };
      }
      return item;
    }));
  };
  
  const handleNewsDislike = (newsId: number) => {
    const newLikedNews = new Set(likedNews);
    const newDislikedNews = new Set(dislikedNews);
    
    if (dislikedNews.has(newsId)) {
      newDislikedNews.delete(newsId);
    } else {
      newDislikedNews.add(newsId);
      newLikedNews.delete(newsId);
    }
    
    setLikedNews(newLikedNews);
    setDislikedNews(newDislikedNews);
    
    setNewsItems(items => items.map(item => {
      if (item.id === newsId) {
        let likes = item.likes;
        let dislikes = item.dislikes;
        
        if (newDislikedNews.has(newsId) && !dislikedNews.has(newsId)) {
          dislikes += 1;
          if (likedNews.has(newsId)) likes -= 1;
        } else if (!newDislikedNews.has(newsId) && dislikedNews.has(newsId)) {
          dislikes -= 1;
        }
        
        return { ...item, likes, dislikes };
      }
      return item;
    }));
  };
  
  const handleCommentLike = (commentId: number) => {
    const newLikedComments = new Set(likedComments);
    const newDislikedComments = new Set(dislikedComments);
    
    if (likedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
      newDislikedComments.delete(commentId);
    }
    
    setLikedComments(newLikedComments);
    setDislikedComments(newDislikedComments);
  };
  
  const handleCommentDislike = (commentId: number) => {
    const newLikedComments = new Set(likedComments);
    const newDislikedComments = new Set(dislikedComments);
    
    if (dislikedComments.has(commentId)) {
      newDislikedComments.delete(commentId);
    } else {
      newDislikedComments.add(commentId);
      newLikedComments.delete(commentId);
    }
    
    setLikedComments(newLikedComments);
    setDislikedComments(newDislikedComments);
  };
  
  const handleRating = (newsId: number, rating: number) => {
    const newRatings = new Map(userRatings);
    newRatings.set(newsId, rating);
    setUserRatings(newRatings);
    
    setNewsItems(items => items.map(item => {
      if (item.id === newsId) {
        const hasUserRated = userRatings.has(newsId);
        const newRatingCount = hasUserRated ? item.ratingCount : item.ratingCount + 1;
        const oldUserRating = userRatings.get(newsId) || 0;
        const totalRating = (item.rating * item.ratingCount) - (hasUserRated ? oldUserRating : 0) + rating;
        const newRating = totalRating / newRatingCount;
        
        return { ...item, rating: newRating, ratingCount: newRatingCount };
      }
      return item;
    }));
  };
  
  const renderStars = (rating: number, interactive: boolean = false, newsId?: number) => {
    const stars = [];
    const userRating = newsId ? userRatings.get(newsId) : 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? i <= (userRating || 0) : i <= Math.round(rating);
      const isHalfFilled = !interactive && i === Math.ceil(rating) && rating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          onClick={() => interactive && newsId && handleRating(newsId, i)}
          className={`transition-all duration-200 ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Icon 
            name="Star" 
            size={16} 
            className={`${
              isFilled ? 'text-yellow-400 fill-yellow-400' : 
              isHalfFilled ? 'text-yellow-400 fill-yellow-200' : 
              'text-gray-300'
            } transition-colors duration-200`} 
          />
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={24} className="text-primary" />
            <h1 className="text-xl font-semibold text-foreground">ИнфоПортал</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActiveSection('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'home' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveSection('search')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'search' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Поиск
            </button>
            <button
              onClick={() => setActiveSection('news')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'news' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Новости
            </button>
          </nav>

          <Button variant="outline" size="sm" className="md:hidden">
            <Icon name="Menu" size={16} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Центр важной информации
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Актуальные новости, экспертная аналитика и открытые обсуждения важных тем
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск информации..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-base"
              />
            </div>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* News Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-foreground">Актуальные материалы</h3>
            <div className="flex items-center space-x-2">
              <Icon name="Newspaper" size={18} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{filteredNews.length} материалов</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Rating Section */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.rating.toFixed(1)} ({item.ratingCount})
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Читать
                      </Button>
                    </div>
                    
                    {/* Interactive Rating */}
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Ваша оценка:</div>
                      <div className="flex items-center space-x-1">
                        {renderStars(0, true, item.id)}
                      </div>
                    </div>
                    
                    {/* Like/Dislike Section */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleNewsLike(item.id)}
                          className={`flex items-center space-x-1 text-xs transition-all duration-200 hover:scale-105 ${
                            likedNews.has(item.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                          }`}
                        >
                          <Icon 
                            name="ThumbsUp" 
                            size={14} 
                            className={`transition-all duration-200 ${
                              likedNews.has(item.id) ? 'fill-primary' : ''
                            }`} 
                          />
                          <span className="font-medium">{item.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleNewsDislike(item.id)}
                          className={`flex items-center space-x-1 text-xs transition-all duration-200 hover:scale-105 ${
                            dislikedNews.has(item.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                          }`}
                        >
                          <Icon 
                            name="ThumbsDown" 
                            size={14} 
                            className={`transition-all duration-200 ${
                              dislikedNews.has(item.id) ? 'fill-red-500' : ''
                            }`} 
                          />
                          <span className="font-medium">{item.dislikes}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="MessageCircle" size={14} />
                          <span>{item.comments.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Eye" size={14} />
                          <span>{Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {item.comments.length > 0 && (
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                          <Icon name="Users" size={14} />
                          <span>Обсуждение</span>
                        </h4>
                        
                        <div className="space-y-3">
                          {item.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">{comment.date}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{comment.text}</p>
                              
                              {/* Comment Likes */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleCommentLike(comment.id)}
                                  className={`flex items-center space-x-1 text-xs transition-all duration-200 hover:scale-105 ${
                                    likedComments.has(comment.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                  }`}
                                >
                                  <Icon 
                                    name="ThumbsUp" 
                                    size={12} 
                                    className={`transition-all duration-200 ${
                                      likedComments.has(comment.id) ? 'fill-primary' : ''
                                    }`} 
                                  />
                                  <span>{comment.likes + (likedComments.has(comment.id) && !likedComments.has(comment.id) ? 1 : 0)}</span>
                                </button>
                                
                                <button
                                  onClick={() => handleCommentDislike(comment.id)}
                                  className={`flex items-center space-x-1 text-xs transition-all duration-200 hover:scale-105 ${
                                    dislikedComments.has(comment.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                                  }`}
                                >
                                  <Icon 
                                    name="ThumbsDown" 
                                    size={12} 
                                    className={`transition-all duration-200 ${
                                      dislikedComments.has(comment.id) ? 'fill-red-500' : ''
                                    }`} 
                                  />
                                  <span>{comment.dislikes + (dislikedComments.has(comment.id) && !dislikedComments.has(comment.id) ? 1 : 0)}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {item.comments.length > 2 && (
                            <button className="text-xs text-primary hover:underline">
                              Показать ещё {item.comments.length - 2} комментариев
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="pt-3 border-t">
                      {selectedNewsId === item.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Ваш комментарий..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedNewsId(null)}
                            >
                              Отмена
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(item.id)}
                            >
                              Отправить
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedNewsId(item.id)}
                        >
                          <Icon name="Plus" size={14} className="mr-2" />
                          Добавить комментарий
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNews.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковый запрос или очистить фильтры
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="font-semibold mb-3">ИнфоПортал</h4>
              <p className="text-sm text-muted-foreground">
                Надёжный источник актуальной информации с возможностью открытого обсуждения
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Разделы</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Главная</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Поиск</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Новости</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} />
                  <span>info@portal.ru</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={14} />
                  <span>+7 (495) 123-45-67</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 ИнфоПортал. Все права защищены.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;