const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../userData/userData.json");

const readUserList = () => {
  const fileContent = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(fileContent);
};

const saveToLocal = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("写入文件失败:", err);
    throw err;
  }
};

// --- 暴露出去是为了给loginContorller用的 ---
exports.readUserList = readUserList;

// --- 获取所有用户 ---
exports.getALlUser = (req, res) => {
  const userlist = readUserList();

  res.status(200).json({
    code: 200,
    data: userlist,
    message: "获取用户数据成功"
  });
};

// --- 删除用户 ---
exports.deleteUser = (req, res) => {
  try {
    const userlist = readUserList();
    const deleteUserId = Number(req.params.id);
    const deleteUserIndex = userlist.findIndex((item) => item.id === deleteUserId);

    if (deleteUserIndex !== -1) {
      const deleteUser = userlist[deleteUserIndex];
      userlist.splice(deleteUserIndex, 1); // 内存删除

      saveToLocal(userlist); // 持久化：同步到文件

      res.status(200).json({
        code: 200,
        message: "删除用户成功",
        data: deleteUser
      });
    } else {
      res.status(404).json({ code: 404, message: "用户不存在" });
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: "删除用户失败" });
  }
};

// --- 新增用户 ---
exports.addUser = (req, res) => {
  try {
    const userlist = readUserList();
    const newUser = req.body;
    // 简单处理：如果没有传ID，自动生成一个
    if (!newUser.id) newUser.id = Date.now();

    userlist.push(newUser); // 内存添加

    saveToLocal(userlist); // 持久化

    res.status(201).json({
      code: 201,
      message: "新增用户成功",
      data: newUser
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "新增用户失败" });
  }
};

// --- 更新用户 ---
exports.updateUser = (req, res) => {
  try {
    const userlist = readUserList();
    const updateUserId = Number(req.params.id);
    const updateUserIndex = userlist.findIndex((item) => item.id === updateUserId);

    if (updateUserIndex === -1) {
      return res.status(404).json({ code: 404, message: "该用户资源不存在" });
    }

    userlist[updateUserIndex] = {
      ...userlist[updateUserIndex],
      ...req.body,
      id: updateUserId // 防止前端表单传入错误的id
    };

    saveToLocal(userlist); // 持久化

    res.status(200).json({
      code: 200,
      message: "更新用户成功",
      data: userlist[updateUserIndex]
    });
  } catch (error) {
    res.status(400).json({ code: 400, message: "更新用户失败" });
  }
};

// --- 批量重置/设置用户数据 ---
exports.setNewUserList = (req, res) => {
  try {
    const newUserListArray = req.body;
    if (!Array.isArray(newUserListArray)) {
      return res.status(400).json({ code: 400, message: "请求体必须是数组" });
    }

    saveToLocal(newUserListArray); // 持久化

    res.status(201).json({
      code: 201,
      message: "设置新的用户数据成功",
      data: newUserListArray
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: "设置新的用户数据失败" });
  }
};
