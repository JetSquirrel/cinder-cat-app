// 动态导入猫咪数据和图片
export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  description: string;
  images: string[];
}

// 动态导入所有猫咪数据
async function loadCatData(): Promise<Cat[]> {
  const cats: Cat[] = [];
  
  // 动态导入 guokui 的数据和图片
  try {
    const guokuiMeta = await import('../images/guokui/meta.json');
    const guokuiImages = await loadCatImages('guokui');
    cats.push({
      ...guokuiMeta.default,
      images: guokuiImages
    });
  } catch (error) {
    console.warn('Failed to load guokui data:', error);
  }

  // 动态导入 mimi 的数据和图片
  try {
    const mimiMeta = await import('../images/mimi/meta.json');
    const mimiImages = await loadCatImages('mimi');
    cats.push({
      ...mimiMeta.default,
      images: mimiImages
    });
  } catch (error) {
    console.warn('Failed to load mimi data:', error);
  }

  return cats;
}

// 动态加载指定猫咪的所有图片
async function loadCatImages(catName: string): Promise<string[]> {
  const images: string[] = [];
  
  // 定义可能的图片文件名模式
  const imageFiles = [
    'IMG_0011.JPEG',
    'IMG_0040.JPG',
    'IMG_0041.JPG',
    'IMG_0060.JPG',
    'IMG_0096.JPG',
    'IMG_0110.JPG',
    'IMG_0118.JPG',
    'IMG_0129.JPG',
    'IMG_0134.JPG',
    'IMG_0138.JPG',
    'IMG_2881.JPEG',
    'IMG_2882.JPEG',
    'IMG_8447.JPG',
    'IMG_8516.JPG',
    'IMG_8604.JPG'
  ];

  for (const fileName of imageFiles) {
    try {
      // 尝试动态导入图片
      const imagePath = `/src/images/${catName}/${fileName}`;
      const imageModule = await import(imagePath);
      images.push(imageModule.default);
    } catch (error) {
      // 如果图片不存在，就跳过
      try {
        // 直接使用路径
        const imagePath = `/src/images/${catName}/${fileName}`;
        images.push(imagePath);
      } catch (e) {
        // 静默忽略不存在的图片
      }
    }
  }

  return images;
}

// 导出数据加载函数
export { loadCatData };
