import React from 'react';
import './footer.less'; 
import {
    HeartFilled
  } from '@ant-design/icons';
export default function LoginPage() {
    return(
    <div className='footer_div'>
        <div className='footer_container'>
        <div className='footer'>
            Copyright © 2023 All rights reserved<HeartFilled style={{ color: 'red', marginLeft: '5px' }} />
         </div>
        </div>
        </div>
    )
}