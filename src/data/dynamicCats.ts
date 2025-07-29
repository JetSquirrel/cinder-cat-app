// 动态猫咪数据加载器
export interface Cat {
  id: number | string;
  name: string;
  age: number;
  breed: string;
  image: string;
  description: string;
  images?: string[];
  currentImageIndex?: number; // 当前显示的图片索引
}

// 动态加载猫咪数据
export async function loadCatsData(): Promise<Cat[]> {
  const cats: Cat[] = [];
  const catFolders = ['guokui', 'mimi']; // 可以根据需要扩展

  for (const folderName of catFolders) {
    try {
      // 获取 meta.json 数据
      const metaResponse = await fetch(`/images/${folderName}/meta.json`);
      if (!metaResponse.ok) {
        console.warn(`Failed to load meta.json for ${folderName}`);
        continue;
      }
      
      const metaData = await metaResponse.json();
      
      // 获取该文件夹中的所有图片
      const images = await loadCatImages(folderName);
      
      cats.push({
        ...metaData,
        image: images[0] || '/images/placeholder.jpg', // 使用第一张图片作为主图
        images: images
      });
    } catch (error) {
      console.warn(`Error loading data for ${folderName}:`, error);
    }
  }

  return cats;
}

// 加载指定猫咪文件夹的所有图片
async function loadCatImages(catFolder: string): Promise<string[]> {
  // 根据实际文件定义每个猫咪的图片列表
  const catImageMap: Record<string, string[]> = {
    'guokui': [
      'IMG_0011.JPEG',
      'IMG_0040.JPG',
      'IMG_0060.JPG',
      'IMG_0096.JPG',
      'IMG_0110.JPG',
      'IMG_0129.JPG',
      'IMG_0138.JPG',
      'IMG_2881.JPEG'
    ],
    'mimi': [
      'IMG_0041.JPG',
      'IMG_0118.JPG',
      'IMG_0134.JPG',
      'IMG_2882.JPEG',
      'IMG_8447.JPG',
      'IMG_8516.JPG',
      'IMG_8604.JPG'
    ]
  };

  const imageFiles = catImageMap[catFolder] || [];
  const existingImages: string[] = [];

  // 验证每张图片是否真的存在
  for (const imageName of imageFiles) {
    try {
      const imageUrl = `/images/${catFolder}/${imageName}`;
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        existingImages.push(imageUrl);
      }
    } catch (error) {
      console.warn(`Image not found: /images/${catFolder}/${imageName}`);
    }
  }

  return existingImages;
}

// 随机选择一张图片的辅助函数
export const getRandomImage = (images: string[]): string => {
  return images[Math.floor(Math.random() * images.length)];
};
