import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface NewsCardProps {
  item: NewsItem;
  likedNews: Set<number>;
  dislikedNews: Set<number>;
  likedComments: Set<number>;
  dislikedComments: Set<number>;
  userRatings: Map<number, number>;
  selectedNewsId: number | null;
  newComment: string;
  onNewsLike: (newsId: number) => void;
  onNewsDislike: (newsId: number) => void;
  onCommentLike: (commentId: number) => void;
  onCommentDislike: (commentId: number) => void;
  onRating: (newsId: number, rating: number) => void;
  onSelectNews: (newsId: number | null) => void;
  onCommentChange: (comment: string) => void;
  onAddComment: (newsId: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  item,
  likedNews,
  dislikedNews,
  likedComments,
  dislikedComments,
  userRatings,
  selectedNewsId,
  newComment,
  onNewsLike,
  onNewsDislike,
  onCommentLike,
  onCommentDislike,
  onRating,
  onSelectNews,
  onCommentChange,
  onAddComment,
}) => {
  const renderStars = (rating: number, interactive: boolean = false, newsId?: number) => {
    const stars = [];
    const userRating = newsId ? userRatings.get(newsId) : 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? i <= (userRating || 0) : i <= Math.round(rating);
      const isHalfFilled = !interactive && i === Math.ceil(rating) && rating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          onClick={() => interactive && newsId && onRating(newsId, i)}
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
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
                onClick={() => onNewsLike(item.id)}
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
                onClick={() => onNewsDislike(item.id)}
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
                        onClick={() => onCommentLike(comment.id)}
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
                        onClick={() => onCommentDislike(comment.id)}
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
                  onChange={(e) => onCommentChange(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectNews(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAddComment(item.id)}
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
                onClick={() => onSelectNews(item.id)}
              >
                <Icon name="Plus" size={14} className="mr-2" />
                Добавить комментарий
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;