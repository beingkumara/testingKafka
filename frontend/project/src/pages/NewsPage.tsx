import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Filter, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getF1News, NewsResponse } from '../services';
import { NewsArticle } from '../types/f1.types';
import LoadingScreen from '../components/ui/LoadingScreen';

const ARTICLES_PER_PAGE = 10;

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);

  // Filter states
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const fetchNews = async (page: number = 1, filters: Record<string, any> = {}) => {
    try {
      setIsFiltering(true);

      // Add pagination parameters
      const params = {
        ...filters,
        page,
        pageSize: ARTICLES_PER_PAGE
      };

      const response: NewsResponse = await getF1News(params);

      setNews(response.articles);
      setHasMorePages(response.hasMore);
      setTotalArticles(response.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch news data
        const newsResponse = await getF1News({ page: 1, pageSize: ARTICLES_PER_PAGE });

        setNews(newsResponse.articles);
        setHasMorePages(newsResponse.hasMore);
        setTotalArticles(newsResponse.totalCount);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;

    // Create filter object with the current filters
    const filters: Record<string, any> = {};

    // Format dates
    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      filters.fromDate = fromDateObj.toISOString().split('T')[0];
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      filters.toDate = toDateObj.toISOString().split('T')[0];
    }

    fetchNews(newPage, filters);
  };

  const handleFilterApply = async () => {
    try {
      // Create filter object with the correct property names and format dates
      const filters: Record<string, any> = {};

      // Format dates to YYYY-MM-DD format expected by the API
      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        filters.fromDate = fromDateObj.toISOString().split('T')[0];
      }
      if (toDate) {
        const toDateObj = new Date(toDate);
        // Set to end of day for toDate to include the entire day
        toDateObj.setHours(23, 59, 59, 999);
        filters.toDate = toDateObj.toISOString().split('T')[0];
      }

      // Reset to first page when applying new filters
      fetchNews(1, filters);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleClearFilters = async () => {
    setFromDate('');
    setToDate('');

    // Reset to first page and clear filters
    fetchNews(1);
  };

  // Handle manual date input changes
  const handleFromDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Formula 1 News</h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Latest news and updates from the world of Formula 1
          </p>
        </div>

        <div className="card mb-8">
          <div className="p-6 border-b border-dark-200 dark:border-dark-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary-500" />
              Filter News
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-dark-700 border border-dark-200 dark:border-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm text-dark-800 dark:text-white"
                    value={fromDate}
                    onChange={handleFromDateInput}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-dark-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-dark-700 border border-dark-200 dark:border-dark-600 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm text-dark-800 dark:text-white"
                    value={toDate}
                    onChange={handleToDateInput}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-dark-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 flex justify-end space-x-3 bg-transparent border-t border-dark-100 dark:border-dark-700">
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-dark-200 dark:border-dark-500 text-gray-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors flex items-center"
              onClick={handleClearFilters}
              disabled={isFiltering}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFiltering ? 'animate-spin' : ''}`} />
              Reset
            </button>

            <button
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center"
              onClick={handleFilterApply}
              disabled={isFiltering}
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              {isFiltering ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {news.length > 0 ? (
            <>
              {news.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="h-48 md:h-auto bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center relative">
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-secondary-400">
                          No image available
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:col-span-2">
                      <div className="flex flex-col mb-4">
                        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                        <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                          {article.description}
                        </p>

                        <div className="flex flex-wrap items-center text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                          <span className="inline-block bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-md mr-3 mb-2">
                            {article.source.name}
                          </span>

                          <div className="flex items-center mr-4 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </div>

                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(article.publishedAt)}
                          </div>
                        </div>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary flex items-center self-start"
                        >
                          Read Full Article
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFiltering}
                    className={`flex items-center justify-center w-10 h-10 rounded-md border ${currentPage === 1
                      ? 'border-dark-200 dark:border-dark-700 text-dark-400 dark:text-dark-500 cursor-not-allowed'
                      : 'border-dark-200 dark:border-dark-600 text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-700'
                      }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Wheel-like page number indicator */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-500 flex items-center justify-center bg-white dark:bg-dark-800 shadow-md">
                      <div className="text-primary-600 dark:text-primary-400 font-bold">
                        {currentPage}
                      </div>
                    </div>
                    {/* Decorative wheel spokes */}
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary-500 border-dashed opacity-30 animate-spin-slow"></div>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMorePages || isFiltering}
                    className={`flex items-center justify-center w-10 h-10 rounded-md border ${!hasMorePages
                      ? 'border-dark-200 dark:border-dark-700 text-dark-400 dark:text-dark-500 cursor-not-allowed'
                      : 'border-dark-200 dark:border-dark-600 text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-700'
                      }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="h-16 w-16 text-secondary-300 mb-4" />
                <p className="text-xl text-secondary-500 dark:text-secondary-400 mb-2">
                  No news articles found
                </p>
                <p className="text-secondary-400 dark:text-secondary-500 mb-6">
                  Try adjusting your filters or check back later for updates
                </p>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default NewsPage;  