import './footer.css'
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <div className='landing-page'>
    <footer>
        <div className="foot-panel1">Back to Top</div>
        <div className="foot-panel2">
            <ul>
                <p>Get to Know Us</p>
                <Link to="#">Careers</Link>
                <Link to="#">Blog</Link>
                <Link to="#">About Farm-Connect</Link>
                <Link to="#">Investor Relations</Link>
                <Link to="#">Our Partners</Link>
                <Link to="#">Research & Innovation</Link>
            </ul>
            <ul>
                <p>Opportunities with Us</p>
                <Link to="#">Sell on Farm-Connect</Link>
                <Link to="#">Provide Farming Services</Link>
                <Link to="#">Join as an Affiliate</Link>
                <Link to="#">Advertise Your Products</Link>
                <Link to="#">Market Collaborations</Link>
            </ul>
            <ul>
                <p>Farm Payment Solutions</p>
                <Link to="#">Farm Business Card</Link>
                <Link to="#">Earn with Farm Points</Link>
                <Link to="#">Top-up Your Account</Link>
                <Link to="#">Currency Converter</Link>
            </ul>
            <ul>
                <p>How Can We Help?</p>
                <Link to="#">COVID-19 Farming Resources</Link>
                <Link to="#">Your Account</Link>
                <Link to="#">Your Orders</Link>
                <Link to="#">Shipping & Delivery</Link>
                <Link to="#">Returns & Replacements</Link>
                <Link to="#">Manage Farm Tools & Devices</Link>
                <Link to="#">Farm Connect Assistant</Link>
                <Link to="#">Help Center</Link>
            </ul>
        </div>

        <div className="foot-panel3">
            <div className="logo"></div>
        </div>

        <div className="foot-panel4">
            <div className="pages">
                <Link to="#">Conditions of Use</Link>
                <Link to="#">Privacy Notice</Link>
                <Link to="#">Your Ads Privacy Choices</Link>
            </div>
            <div className="copyright">
                © 1996-2024, Farm-Connect.com, Inc. or its affiliates
            </div>
        </div>
    </footer>
</div>
  )
}
