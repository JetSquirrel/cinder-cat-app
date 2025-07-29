import { useState, useEffect } from 'react';
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
  const [usedImageSets, setUsedImageSets] = useState<Set<string>>(new Set());

  // 为每只猫咪生成一个带有随机图片的副本
  const generateCatWithRandomImage = (originalCat: Cat): Cat => {
    if (!originalCat.images || originalCat.images.length === 0) {
      return originalCat;
    }

    // 创建一个新的猫咪对象，随机选择一张图片作为主图
    const randomIndex = Math.floor(Math.random() * originalCat.images.length);
    
    // 如果这个图片组合已经用过，尝试其他图片
    let finalIndex = randomIndex;
    let attempts = 0;
    while (usedImageSets.has(`${originalCat.id}-${finalIndex}`) && attempts < originalCat.images.length) {
      finalIndex = (finalIndex + 1) % originalCat.images.length;
      attempts++;
    }

    return {
      ...originalCat,
      image: originalCat.images[finalIndex],
      currentImageIndex: finalIndex,
      id: Date.now() + Math.random() // 生成唯一ID确保重新渲染
    };
  };

  // 生成新一轮的猫咪
  const generateNewRound = () => {
    if (originalCats.length === 0) return [];
    
    return originalCats.map(cat => generateCatWithRandomImage(cat));
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

  const handleSwipeRight = () => {
    if (cats.length > 0) {
      const likedCat = cats[cats.length - 1];
      setLikedCats(prev => [...prev, likedCat]);
      
      // 记录已使用的图片组合
      if (likedCat.currentImageIndex !== undefined) {
        setUsedImageSets(prev => new Set([...prev, `${likedCat.id}-${likedCat.currentImageIndex}`]));
      }
      
      setCats(prev => {
        const newCats = prev.slice(0, -1);
        
        // 如果只剩一只猫或没猫了，开始新一轮
        if (newCats.length <= 1) {
          // 清除部分使用记录，保持一些变化
          setUsedImageSets(prev => {
            const newSet = new Set(prev);
            if (newSet.size > 10) { // 如果记录太多，清除一半
              const arr = Array.from(newSet);
              const toRemove = arr.slice(0, Math.floor(arr.length / 2));
              toRemove.forEach(key => newSet.delete(key));
            }
            return newSet;
          });
          
          const newRound = generateNewRound();
          return [...newCats, ...newRound];
        }
        
        return newCats;
      });
    }
  };

  const handleLikeClick = () => {
    handleSwipeRight();
  };

  const handleReset = () => {
    setCats(originalCats.map(cat => generateCatWithRandomImage(cat)));
    setLikedCats([]);
    setUsedImageSets(new Set());
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
            <AnimatePresence>
              {cats.slice(-2).map((cat, index) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  onSwipeRight={handleSwipeRight}
                  style={{
                    zIndex: index === 1 ? 2 : 1,
                    scale: index === 0 ? 0.95 : 1,
                  }}
                />
              ))}
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
