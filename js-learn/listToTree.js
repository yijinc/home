const input = [
  ['盒马', '杭州', '万象汇店', '前场'],
  ['盒马', '杭州', '万象汇店', '餐饮'],
  ['盒马', '上海', '曹家渡店', '物流'],
];

// const output = [
//   {
//     label: '盒马',
//     children: [
//       {
//         label: '杭州',
//         children: [
//           {
//             label: '万象汇店',
//             children: [{ label: '前场' }, { label: '餐饮' }],
//           },
//         ],
//       },
//       {
//         label: '上海',
//         children: [
//           {
//             label: '曹家渡店',
//             children: [{ label: '物流' }],
//           },
//         ],
//       },
//     ],
//   },
// ];

function listToTree(arr) {
	const tempObj = {};
	const res = [];
	for (let i = 0; i < arr.length; i++) {
	    for (let j = 0; j < arr[i].length; j++) {
          const item = arr[i][j];
	        if (!tempObj[item]) {
              tempObj[item] = {
	                label: item,
	            };
	        }
	        if (j > 0) {
              // 第二个 查找父级 为当前i 前一个 j-1 item
	            const parent = tempObj[arr[i][j - 1]];
	            if (parent) {
                  if (!parent.children) {
                    parent.children = [];
                  }
	                if (parent.children.indexOf(tempObj[item]) < 0) {
	                    parent.children.push(tempObj[item]);
	                }
	            }
	        } else {
            // 第一级 不存在 直接push
	            if (res.indexOf(tempObj[item]) === -1) {
	                res.push(tempObj[item]);
	            }
	        }
	    }
	}
	return res;
}


listToTree(input)
