import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <h1>Добро пожаловать!</h1>
      <p>Это главная страница</p>
      <Link to="/users">Перейти к списку пользователей</Link>
    </div>
  );
};

export default MainPage;
