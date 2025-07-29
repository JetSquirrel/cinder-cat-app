import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { Cat } from '../data/dynamicCats';

interface CatCardProps {
  cat: Cat;
  onSwipeRight: () => void;
  style?: React.CSSProperties;
}

const CatCard: React.FC<CatCardProps> = ({ cat, onSwipeRight, style }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(cat.currentImageIndex || 0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // 当猫咪改变时，重置图片索引
  useEffect(() => {
    setCurrentImageIndex(cat.currentImageIndex || 0);
  }, [cat.id, cat.currentImageIndex]);

  const currentImage = cat.images && cat.images.length > 0 
    ? cat.images[currentImageIndex] || cat.image 
    : cat.image;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // 右滑喜欢
      onSwipeRight();
    } else {
      // 返回原位置
      x.set(0);
    }
  };

  const handleImageClick = () => {
    // 点击图片切换到下一张
    if (cat.images && cat.images.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % cat.images!.length);
    }
  };

  const totalImages = cat.images?.length || 1;
  const displayIndex = currentImageIndex + 1;

  return (
    <motion.div
      className="cat-card"
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        x: 300, 
        opacity: 0, 
        scale: 0.8,
        transition: { duration: 0.3 }
      }}
    >
      <img 
        src={currentImage} 
        alt={cat.name}
        className="cat-image"
        draggable={false}
        onClick={handleImageClick}
        style={{ cursor: cat.images && cat.images.length > 1 ? 'pointer' : 'default' }}
      />
      {cat.images && cat.images.length > 1 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '0.8rem'
        }}>
          {displayIndex}/{totalImages}
        </div>
      )}
      <div className="cat-info">
        <div>
          <h2 className="cat-name">{cat.name}</h2>
          <p className="cat-details">{cat.age}岁 • {cat.breed}</p>
        </div>
        <p className="cat-description">{cat.description}</p>
        {cat.images && cat.images.length > 1 && (
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
            点击图片查看更多照片
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CatCard;
