import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { Cat } from '../data/dynamicCats';

interface CatCardProps {
  cat: Cat;
  onSwipeRight: () => void;
  style?: React.CSSProperties;
  isTopCard?: boolean; // 新增：标识是否为顶层卡片
}

const CatCard: React.FC<CatCardProps> = ({ cat, onSwipeRight, style, isTopCard = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(cat.currentImageIndex || 0);
  const [showLikeEffect, setShowLikeEffect] = useState(false);
  const [showRejectEffect, setShowRejectEffect] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // 爱心显示的透明度，基于右滑距离
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  // 禁止图标显示的透明度，基于左滑距离  
  const rejectOpacity = useTransform(x, [-150, -50], [1, 0]);

  // 当猫咪改变时，重置图片索引
  useEffect(() => {
    setCurrentImageIndex(cat.currentImageIndex || 0);
  }, [cat.id, cat.currentImageIndex]);

  const currentImage = cat.images && cat.images.length > 0 
    ? cat.images[currentImageIndex] || cat.image 
    : cat.image;

  const handleDragStart = () => {
    if (isTopCard) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // 只有顶层卡片才能触发滑动
    if (!isTopCard) return;
    
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // 右滑喜欢 - 显示爱心特效
      setShowLikeEffect(true);
      console.log(`卡片滑动: ${cat.name}, 图片: ${cat.image}`);
      
      // 添加微小延迟，确保前一个操作完成
      setTimeout(() => {
        onSwipeRight();
        setShowLikeEffect(false);
      }, 300);
    } else if (info.offset.x < -swipeThreshold) {
      // 左滑拒绝 - 显示禁止特效
      setShowRejectEffect(true);
      setTimeout(() => {
        setShowRejectEffect(false);
        x.set(0); // 返回原位置
      }, 500);
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
      className={`cat-card ${isDragging ? 'dragging' : ''}`}
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag={isTopCard ? "x" : false} // 只有顶层卡片才能拖拽
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
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
      {/* 右滑爱心特效 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '4rem',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: likeOpacity,
        }}
      >
        💖
      </motion.div>

      {/* 左滑禁止特效 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '4rem',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: rejectOpacity,
        }}
      >
        🚫
      </motion.div>

      {/* 爱心弹出特效 */}
      <AnimatePresence>
        {showLikeEffect && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '6rem',
              zIndex: 15,
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0],
              y: [0, -50]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ❤️
          </motion.div>
        )}
      </AnimatePresence>

      {/* 禁止标志弹出特效 */}
      <AnimatePresence>
        {showRejectEffect && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '6rem',
              zIndex: 15,
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0],
              rotate: [0, 10, -10, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ❌
          </motion.div>
        )}
      </AnimatePresence>

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
