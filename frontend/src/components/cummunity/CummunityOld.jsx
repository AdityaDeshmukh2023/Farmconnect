import './cummunity.css';
import CummunityPost from '../cummunity-post/CummunityPost'
import Share from '../share/Share'
import {CuPosts} from "../../dummyData";


export default function Cummunity() {
  return (
        <div className='feed'>
          
            <div className="feedWrapperleft">
            {CuPosts.map((p)=>(
              <CummunityPost key={p.id} post = {p}/>
            ))}
            </div>
            
            <div className="feedWrapperRight">
              <Share/>
            </div>
        
        </div>
  )
}