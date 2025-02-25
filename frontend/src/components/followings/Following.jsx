import './following.css'

export default function Following({ user }) {
  return (
    <div className="followingContainer">
      
        <li className="rightbarFriend">
          <img src={`http://127.0.0.1:8000/${user.profile_picture}`} alt="" className="rightbarFriendImg" />
          <span className="sidebarFriendName">{user.name}</span>
        </li>
      
    </div>
  );
}
