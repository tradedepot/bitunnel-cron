'use strict';

exports.mailTextTemplate = errorArray => `
	Hello,\n
	Kindly review the following errors thrown within the period under review\n\n
	Time\t Exception Type\t Ref\t Message\t Start Point\t Failure Point\t Origin User \n
	${errorArray.map(err => `
		${err.time}\t ${err.exceptionType}\t ${err.objectReference || 'Nil'}\t ${err.message}\t ${err.startPoint}\t ${err.failurePoint} \t ${err.originUser || 'Nil'}\n
	`)}
	\n\n
	The Bitunnel Team.
`;
