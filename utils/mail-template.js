'use strict';

exports.htmlTemplate = errorArray => `
 <style>
  .bt-error {
    border: 1px solid #ddd;
    border-collapse: collapse;
    padding: 5px;
    border-spacing: 0;
    width: 100%;
  }
  
  .bt-error th {
    border: 1px solid #ddd;
    padding: 5px;
    background: #F0F0F0;
  }
  
  .bt-error td {
    border: 1px solid #ddd;
    padding: 5px;
  }
  </style>
<p>
	Hello,
</p>
<p>
	Kindly review the following errors thrown within the period under review
</p>
<div style="overflow-x:auto;">
		<table class="bt-error">
	    <thead>
	      <tr>
	        <th>Time</th>
	        <th>Exception Type</th>
	        <th>Ref</th>
	        <th>Message</th>
	        <th>Start Point</th>
	        <th>Failure Point</th>
	        <th>Origin User</th>
	      </tr>
	    </thead>
	    <tbody>
	    ${errorArray.map(err => `
	      <tr>
	        <td>${err.time}</td>
	        <td>${err.exceptionType}</td>
	        <td>${err.objectReference || 'Nil'}</td>
	        <td>${err.message}</td>
	        <td>${err.startPoint}</td>
	        <td>${err.failurePoint}</td>
	        <td>${err.originUser || 'Nil'}</td>
	      </tr>
	      `)}
	    </tbody>
	</table>
</div>
<p>
The Bitunnel Team.
</p>
`;


exports.textTemplate = errorArray => `
	Hello,\n
	Kindly review the following errors thrown within the period under review\n\n
	Time\t Exception Type\t Ref\t Message\t Start Point\t Failure Point\t Origin User \n
	${errorArray.map(err => `${err.time}\t ${err.exceptionType}\t ${err.objectReference || 'Nil'}\t ${err.message}\t ${err.startPoint}\t ${err.failurePoint} \t ${err.originUser || 'Nil'}\n
	`)}	
	The Bitunnel Team.
`;
