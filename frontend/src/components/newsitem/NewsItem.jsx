import './newsitem.css';
import { Component } from 'react';

export class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl } = this.props;
    return (
      <div className="news-item">
        <div className="card news-card">
          <img
            src={imageUrl ? imageUrl : '/assets/news/newss.png'}
            className="card-img-top news-card-img"
            alt="..."
          />
          <div className="card-body news-card-body">
            <h5 className="card-title news-card-title">{title}</h5>
            <p className="card-text news-card-text">{description}</p>
            <a
              rel="noreferrer"
              href={newsUrl}
              target="_blank"
              className="btn btn-sm btn-dark news-read-more-btn"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItem;
