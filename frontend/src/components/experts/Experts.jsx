import './experts.css';
import Expert from '../expert/Expert'
import { Exp } from '../../dummyData'

export default function Experts() {

  return (
    <div className='experts'>
       <h1 className='expertsHead'>Our Experts</h1>
      <div className="expertsConatiner">
       
        <div id="expertsList" class="experts-list">
        {Exp.map((p) => (
            <Expert key={p.id} Expert={p} />
          ))}
        </div>
        
      </div>


    </div>
  )
}
