import './dairy.css';
import { albums } from '../../dummyData';
import { Link } from 'react-router-dom';

export default function Dairy() {
  return (
    <div className="album-container">
      <h1 className="album-title">Dairy and Poultry Gauidance</h1>
      <div className="album-grid">
        {albums.map((album) => (
          <Link to={`/application/${album.id}`} key={album.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="album-card">
              <img src={album.image} alt={album.title} className="album-image" />
              <h3 className="album-card-title">{album.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
