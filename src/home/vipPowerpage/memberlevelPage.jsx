import React from "react";
import { Progress} from "antd";
import "./MemberLevelPage.css"; 

// 模拟的用户数据
const user = {
  totalSpent: 1500, // 用户累计消费金额
};


// 根据累计消费计算当前会员等级和下一个等级所需的消费
function getMembershipInfo(totalSpent) {
  const levels = [
    { level: "青铜", discount: 1.0, nextThreshold: 800 },
    { level: "白银", discount: 0.98, nextThreshold: 2000 },
    { level: "黄金", discount: 0.97, nextThreshold: 3000 },
    { level: "铂金", discount: 0.95, nextThreshold: 5000 },
    { level: "钻石", discount: 0.9, nextThreshold: Infinity },
  ];

  let currentLevel = levels[0];
  for (let i = 0; i < levels.length; i++) {
    if (totalSpent >= levels[i].nextThreshold) {
      currentLevel = levels[i];
    } else {
      break;
    }
  }

  return {
    currentLevel,
    nextLevel:
      levels[
        currentLevel.nextThreshold === Infinity
          ? levels.length - 1
          : levels.indexOf(currentLevel) + 1
      ],
  };
}

export default function MemberLevelPage() {
  const { currentLevel, nextLevel } = getMembershipInfo(user.totalSpent);
  const percentage = (user.totalSpent / nextLevel.nextThreshold) * 100;

  return (
    <div className="memberLevelPage">
      <div>
        <span>Lv:青铜会员</span>
        <Progress
          className="progress"
          percent={percentage}
          status="active"
          showInfo={true}
        />
        <p>
          下一级 Lv:{nextLevel.level} (累计消费：{nextLevel.nextThreshold}元)
        </p>
      </div>

      <div className="site-layout-content">

      </div>
    </div>
  );
}
