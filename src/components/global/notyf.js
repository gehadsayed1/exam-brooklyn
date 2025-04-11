// 📁 src/components/dashboard/notyf.js
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
  position: { x: 'right', y: 'bottom' }
});

export default notyf;
