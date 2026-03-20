import React, { useState, useEffect, useCallback } from "react";
import s from "./UserList.module.scss";
import type { User, UsersResponse } from "../../types/users";
import Pagination from "../ui/Pagination/Pagination";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [totalSearchResults, setTotalSearchResults] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const USERS_PER_PAGE = 10;

  const fetchUsers = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false);
      const skip = (page - 1) * USERS_PER_PAGE;
      const response = await fetch(
        `https://dummyjson.com/users?limit=${USERS_PER_PAGE}&skip=${skip}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(
    async (query: string, page: number) => {
      if (!query.trim()) {
        setIsSearching(false);
        setSearchResults([]);
        setTotalSearchResults(0);
        fetchUsers(page);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsSearching(true);
        const skip = (page - 1) * USERS_PER_PAGE;
        const response = await fetch(
          `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=${USERS_PER_PAGE}&skip=${skip}`,
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data: UsersResponse = await response.json();
        setSearchResults(data.users);
        setTotalSearchResults(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery, currentPage);
      } else {
        setIsSearching(false);
        setSearchResults([]);
        setTotalSearchResults(0);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers, currentPage]);

  useEffect(() => {
    if (!isSearching && !searchQuery) {
      fetchUsers(currentPage);
    }
  }, [currentPage, fetchUsers, isSearching, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const displayedUsers = isSearching ? searchResults : users;
  const totalPages = Math.ceil(
    (isSearching ? totalSearchResults : totalUsers) / USERS_PER_PAGE,
  );

  const getUserFullName = (user: User) => `${user.firstName} ${user.lastName}`;

  return (
    <div className={s["user-list-container"]}>
      <h1>Каталог пользователей</h1>

      <div className={s["search-section"]}>
        <input
          type="text"
          placeholder="Поиск пользователей"
          value={searchQuery}
          onChange={handleSearchChange}
          className={s["search-input"]}
        />
        {searchQuery && (
          <div className={s["search-info"]}>
            Найдено {totalSearchResults} пользователей по запросу "{searchQuery}"
          </div>
        )}
      </div>

      {loading && <div className={s["loading"]}>Loading...</div>}

      {error && <div className={s["error"]}>{error}</div>}

      {!loading && !error && (
        <>
          <div className={s["users-grid"]}>
            {displayedUsers.map((user) => (
              <div key={user.id} className={s["user-card"]}>
                <img
                  src={user.image}
                  alt={getUserFullName(user)}
                  className={s["user-avatar"]}
                />
                <div className={s["user-info"]}>
                  <h3>{getUserFullName(user)}</h3>
                  <p className={s["user-username"]}>@{user.username}</p>
                  <a href={`mailto:${user.email}`} className={s["user-email"]}>
                    {user.email}
                  </a>
                  <a href={`tel:${user.phone}`} className={s["user-phone"]}>
                    {user.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {displayedUsers.length === 0 && (
            <div className={s["no-results"]}>Пользователи не найдены</div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
