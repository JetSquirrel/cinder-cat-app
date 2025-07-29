import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import CatCard from './components/CatCard';
import { loadCatsData } from './data/dynamicCats';
import type { Cat } from './data/dynamicCats';
import './App.css';

function App() {
  const [originalCats, setOriginalCats] = useState<Cat[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [likedCats, setLikedCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // 添加处理状态防止重复触发

  const usedImageSetsRef = useRef(new Set<string>()); // 使用 useRef 替代状态

  // 为每只猫咪生成一个带有随机图片的副本
  const generateCatWithRandomImage = (originalCat: Cat, excludeImageIndex?: number): Cat => {
    if (!originalCat.images || originalCat.images.length === 0) {
      return originalCat;
    }

    const originalId = originalCat.name;
    // 生成所有可用图片索引（未被用过且不为排除索引）
    const availableIndexes = originalCat.images
      .map((_, idx) => idx)
      .filter(idx =>
        (!usedImageSetsRef.current.has(`${originalId}-${idx}`)) &&
        (excludeImageIndex === undefined || idx !== excludeImageIndex)
      );

    let finalIndex;
    if (availableIndexes.length > 0) {
      // 随机选一个可用的
      finalIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    } else {
      // 没有可用的，只能选未排除的
      const fallbackIndexes = originalCat.images
        .map((_, idx) => idx)
        .filter(idx => excludeImageIndex === undefined || idx !== excludeImageIndex);
      finalIndex = fallbackIndexes.length > 0
        ? fallbackIndexes[Math.floor(Math.random() * fallbackIndexes.length)]
        : 0;
      console.warn(`无法生成未使用的图片: ${originalId}，只能重复使用`);
    }

    const selectedImage = originalCat.images[finalIndex];
    const uniqueId = `${originalId}-${finalIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`生成猫咪卡片: ${originalCat.name}, 图片索引: ${finalIndex}, 图片: ${selectedImage}, 排除索引: ${excludeImageIndex}, 唯一ID: ${uniqueId}`);

    return {
      ...originalCat,
      image: selectedImage,
      currentImageIndex: finalIndex,
      id: uniqueId
    };
  };

  // 在组件挂载时加载猫咪数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const catsData = await loadCatsData();
        setOriginalCats(catsData);
        setCats(catsData.map(cat => generateCatWithRandomImage(cat)));
        setError(null);
      } catch (err) {
        setError('加载猫咪数据失败');
        console.error('Error loading cats data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSwipeRight = useCallback(() => {
    // 添加防重复触发保护
    if (isProcessing || cats.length === 0) {
      console.log('跳过操作 - 正在处理中或没有猫咪');
      return;
    }
    
    setIsProcessing(true);
    
    const likedCat = cats[cats.length - 1];
    console.log(`右滑喜欢: ${likedCat.name}, 图片: ${likedCat.image}, 索引: ${likedCat.currentImageIndex}`);
    
    setLikedCats(prev => [...prev, likedCat]);
    
    // 记录已使用的图片组合
    if (likedCat.currentImageIndex !== undefined) {
      const originalId = likedCat.name; // 使用名字作为原始标识
      const imageKey = `${originalId}-${likedCat.currentImageIndex}`;
      console.log(`添加到已使用列表: ${imageKey}`);
      usedImageSetsRef.current.add(imageKey); // 更新 useRef
    }
    
    // 使用回调函数确保状态更新是原子性的
    setCats(prev => {
      const newCats = prev.slice(0, -1);
      console.log(`剩余猫咪数量: ${newCats.length}`);
      
      // 如果已无剩余猫咪，开始新一轮
      if (newCats.length === 0) {
        console.log('开始新一轮猫咪');
        const newRound = originalCats.map(cat => {
          // 为上轮喜欢的猫咪排除当前图片索引
          const excludeIndex = (cat.name === likedCat.name) ? likedCat.currentImageIndex : undefined;
          if (excludeIndex !== undefined) {
            console.log(`排除索引: ${excludeIndex}`);
          }
          return generateCatWithRandomImage(cat, excludeIndex);
        });
        console.log(`生成新一轮，猫咪数量: ${newRound.length}`);
        return newRound;
      }
      return newCats;
    });
    
    // 延迟重置处理状态，防止快速连续操作
    setTimeout(() => {
      setIsProcessing(false);
      console.log('重置处理状态');
    }, 500); // 增加延迟时间
  }, [isProcessing, cats, originalCats]); // 添加依赖项

  const handleLikeClick = useCallback(() => {
    handleSwipeRight();
  }, [handleSwipeRight]);

  const handleReset = () => {
    setCats(originalCats.map(cat => generateCatWithRandomImage(cat)));
    setLikedCats([]);
    usedImageSetsRef.current.clear(); // 清空记录
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">🐱 Cinder</h1>
          <p className="app-subtitle">正在加载猫咪数据...</p>
        </header>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐾</div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">🐱 Cinder</h1>
          <p className="app-subtitle">加载出错了</p>
        </header>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>😿</div>
          <p>{error}</p>
          <button className="reset-button" onClick={handleReset} style={{ marginTop: '20px' }}>
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🐱 Cinder</h1>
        <p className="app-subtitle">请喜欢我的猫咪</p>
      </header>

      {cats.length > 0 ? (
        <>
          <div className="cards-container">
            <AnimatePresence mode="popLayout">
              {(() => {
                const visibleCats = cats.slice(-2);
                return visibleCats.map((cat, index) => (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    onSwipeRight={handleSwipeRight}
                    isTopCard={index === visibleCats.length - 1}
                    style={{
                      zIndex: index === visibleCats.length - 1 ? 2 : 1,
                      scale: visibleCats.length === 2 && index === 0 ? 0.95 : 1,
                    }}
                  />
                ));
              })()}
            </AnimatePresence>
          </div>  

          <div className="action-buttons">
            <button
              className="action-button like-button"
              onClick={handleLikeClick}
              aria-label="喜欢这只猫"
            >
              💖
            </button>
          </div>
          
          {/* 显示统计信息 */}
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            left: '20px', 
            background: 'rgba(255,255,255,0.9)', 
            padding: '10px 15px', 
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: '#333'
          }}>
            已喜欢: {likedCats.length} 只猫咪 💖
          </div>
          
          {/* 重置按钮 */}
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px'
          }}>
            <button 
              className="reset-button" 
              onClick={handleReset}
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
            >
              重置
            </button>
          </div>
        </>
      ) : (
        <div className="end-message">
          <h2 className="end-title">⏳ 准备中...</h2>
          <p className="end-subtitle">正在为您准备新的猫咪</p>
        </div>
      )}
    </div>
  );
}

export default App;
