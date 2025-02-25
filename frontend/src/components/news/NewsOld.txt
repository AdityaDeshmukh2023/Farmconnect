import './news.css';
import { Component } from "react";
import NewsItem from '../newsitem/NewsItem';
import SchemesSlider from '../schemesslider/ShemeSlider'

export class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [], // Initialize as an empty array
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles = async () => {
    const { page } = this.state;
  
    // Get the current date
    const currentDate = new Date();
  
    // Subtract one month while ensuring the day remains consistent
    let adjustedMonth = currentDate.getMonth() - 1;
    let adjustedYear = currentDate.getFullYear();
  
    // Handle the edge case where the month becomes negative (i.e., previous year)
    if (adjustedMonth < 0) {
      adjustedMonth = 11; // December
      adjustedYear -= 1;  // Previous year
    }
  
    // Create a new date object with adjusted month and current day
    const adjustedDate = new Date(adjustedYear, adjustedMonth, currentDate.getDate() + 1);
  
    // Format date to YYYY-MM-DD
    const formattedDate = adjustedDate.toISOString().split('T')[0];
    console.log(formattedDate);
    //API = 57071cbb61b94e9c9f7308f4f8a13c35
    const url = `https://newsapi.org/v2/everything?q=crops&from=${formattedDate}&sortBy=publishedAt&apiKey=57071cbb61b94e9c9f7308f4f8a13c35&page=${page}&pageSize=20`;
  
    this.setState({ loading: true });
  
    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      this.setState({
        articles: parsedData.articles || [], // Ensure it's an array
        totalResults: parsedData.totalResults || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false, articles: [] }); // Fallback to an empty array on error
    }
  };

  handleNextClick = async () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      () => this.fetchArticles()
    );
  };

  handlePrevClick = async () => {
    this.setState(
      (prevState) => ({ page: prevState.page - 1 }),
      () => this.fetchArticles()
    );
  };

  render() {
    const { articles, page, totalResults, loading } = this.state;

    return (
      <div className="news-container">
        <SchemesSlider />
        <div className="news-main-container">
          <h1 className="news-heading">Top Agriculture Headlines</h1>

          {loading ? (
            <div className="loading-container text-center my-5">
              <p>Loading news articles, please wait...</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="news-row">
              {articles.map((article) => (
                <div className="news-col" key={article.url}>
                  <NewsItem
                    title={
                      article.title
                        ? article.title.slice(0, 45) + (article.title.length > 45 ? "..." : "")
                        : "No Title Available"
                    }
                    description={
                      article.description
                        ? article.description.slice(0, 84) + (article.description.length > 84 ? "..." : "")
                        : "No Description Available"
                    }
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-news-container text-center my-5">
              <p>No news articles available. Please try again later.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="pagination-container">
            <button
              type="button"
              className="pagination-btn prev-btn"
              onClick={this.handlePrevClick}
              disabled={page === 1}
            >
              &larr; Previous
            </button>
            <button
              type="button"
              className="pagination-btn next-btn"
              onClick={this.handleNextClick}
              disabled={page >= Math.ceil(totalResults / 20)}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default News;
