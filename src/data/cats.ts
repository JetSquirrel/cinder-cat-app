// 猫咪数据类型定义
export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  image: string;
  description: string;
  images?: string[]; // 可选的多张图片
}

// 锅盔的图片列表
const guokuiImages = [
  '/images/guokui/IMG_0011.JPEG',
  '/images/guokui/IMG_0040.JPG',
  '/images/guokui/IMG_0060.JPG',
  '/images/guokui/IMG_0096.JPG',
  '/images/guokui/IMG_0110.JPG',
  '/images/guokui/IMG_0129.JPG',
  '/images/guokui/IMG_0138.JPG',
  '/images/guokui/IMG_2881.JPEG'
];

// 咪咪的图片列表
const mimiImages = [
  '/images/mimi/IMG_0041.JPG',
  '/images/mimi/IMG_0118.JPG',
  '/images/mimi/IMG_0134.JPG',
  '/images/mimi/IMG_2882.JPEG',
  '/images/mimi/IMG_8447.JPG',
  '/images/mimi/IMG_8516.JPG',
  '/images/mimi/IMG_8604.JPG'
];

// 真实的猫咪数据
export const catsData: Cat[] = [
  {
    id: 1,
    name: "锅盔",
    age: 3,
    breed: "奶牛猫",
    image: guokuiImages[0], // 使用第一张图片作为主图
    images: guokuiImages,
    description: "喜欢晒太阳的可爱奶牛猫"
  },
  {
    id: 2,
    name: "咪咪",
    age: 2,
    breed: "中华田园猫",
    image: mimiImages[0], // 使用第一张图片作为主图
    images: mimiImages,
    description: "活泼好动的小猫咪，喜欢玩耍"
  }
];

// 随机选择一张图片的辅助函数
export const getRandomImage = (images: string[]): string => {
  return images[Math.floor(Math.random() * images.length)];
};
