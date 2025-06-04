import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopDetailsAPI } from '../services/apiClient';
import { type ShopType } from '../types/search';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

import {
  FaImage,FaExternalLinkAlt, FaTag,
} from 'react-icons/fa';
import SectionHeader from '../features/shop_detail/components/SectionHeader';
import BasicInfoCard from '../features/shop_detail/components/BasicInfoCard';
import FacilitiesCard from '../features/shop_detail/components/FacilitiesCard';

const DetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const [shopDetails, setShopDetails] = useState<ShopType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setError("店舗IDが指定されていません。");
      setIsLoading(false);
      return;
    }
    const fetchShopDetails = async () => {
      setIsLoading(true);
      setError(null);
      setShopDetails(null);
      try {
        const data = await getShopDetailsAPI(shopId);
        setShopDetails(data);
        // selectedImage のロジックは不要に
      } catch (err) {
        setError(err instanceof Error ? err.message : "店舗情報の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShopDetails();
  }, [shopId]);

  const mainImageUrl = useMemo(() => {
    if (!shopDetails?.photo) return 'https://via.placeholder.com/800x600?text=No+Image';
      return shopDetails.photo.pc?.l ||
            shopDetails.photo.pc?.m ||
            shopDetails.photo.pc?.s ||
            shopDetails.photo.mobile?.l ||
            shopDetails.photo.mobile?.s ||
            'https://via.placeholder.com/800x600?text=No+Image';
  }, [shopDetails]);


  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><LoadingSpinner text="店舗情報を読み込んでいます..." /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <ErrorMessage message={error} title="情報取得エラー" />
      <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 rounded-md text-sm font-medium transition-colors app-button-primary">検索トップに戻る</button>
    </div>
  );
  if (!shopDetails) return (
    <div className="text-center p-10">
      <p className="text-lg text-gray-600 dark:text-slate-400">店舗情報が見つかりませんでした。</p>
      <button onClick={() => navigate('/')} className="mt-6 inline-block px-6 py-2 rounded-md text-sm font-medium transition-colors app-button-primary">検索トップに戻る</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      <button onClick={() => navigate(-1)} className="mb-2 sm:mb-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 rounded-md">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        前に戻る
      </button>

      <header className="mb-6 border-b border-gray-200 dark:border-slate-700 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
          src={shopDetails.photo?.pc?.l || shopDetails.photo?.mobile?.l || 'https://via.placeholder.com/150?text=No+Image'}
          alt={`${shopDetails.name} ロゴ`}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md border border-gray-200 dark:border-slate-700"
        />
          <div className="flex-grow">
            <h1 className="search-page-heading text-3xl md:text-4xl lg:text-5xl mb-1">
              {shopDetails.name}
            </h1>
            {shopDetails.catch && <p className="text-lg text-gray-600 dark:text-slate-300 italic">"{shopDetails.catch}"</p>}
          </div>
        </div>
        {shopDetails.genre?.name && <p className="text-md text-gray-500 dark:text-slate-400 mt-3">{shopDetails.genre.name} {shopDetails.genre.catch && `- ${shopDetails.genre.catch}`}</p>}
      </header>

      {/* メイン画像 (1枚表示) */}
      <section aria-labelledby="main-photo-heading" className="mb-6">
        <SectionHeader icon={FaImage} title="店舗写真" />
        <img src={mainImageUrl} alt={`${shopDetails.name} メイン画像`} className="w-full max-h-[500px] object-cover rounded-lg shadow-xl" />
      </section>

      {/* 主要情報グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <BasicInfoCard shop={shopDetails} />
        <FacilitiesCard shop={shopDetails} />
      </div>

      {/* 外部リンク (ホットペッパー) とクーポン */}
      {(shopDetails.urls?.pc || shopDetails.coupon_urls?.pc || shopDetails.coupon_urls?.sp) && (
        <section className="mt-6 md:mt-8 text-center space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          {shopDetails.urls?.pc && (
            <a
              href={shopDetails.urls.pc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm 
                        text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                        dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-500"
            >
              ホットペッパーで予約・詳細
              <FaExternalLinkAlt className="ml-2 h-4 w-4" />
            </a>
          )}
          {(shopDetails.coupon_urls?.pc || shopDetails.coupon_urls?.sp) && (
            <a
              href={shopDetails.coupon_urls.sp || shopDetails.coupon_urls.pc} // SP優先
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm 
                        text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                        dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-500"
            >
              クーポンを見る
              <FaTag className="ml-2 h-4 w-4" />
            </a>
          )}
        </section>
      )}
    </div>
  );
};

export default DetailPage;