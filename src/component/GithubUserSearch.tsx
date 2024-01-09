import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  fetchGitHubUsers,
  fetchGitHubUserDetails,
} from "../services/githubService";

const { Column } = Table;

function GitHubUserSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);
  const [pageSize,setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchGitHubUsers(searchTerm, page,pageSize);
        setLength(data.total_count);
        const userDetailsPromises = data.items.map((user: { login: string }) =>
          fetchGitHubUserDetails(user.login)
        );
        const userDetails = await Promise.all(userDetailsPromises);
        const usersWithFollowers = data.items.map(
          (user: any, index: number) => ({
            ...user,
            followers: userDetails[index].followers,
          })
        );
        setUsers(usersWithFollowers);
      } catch (error) {
        console.error("Error fetching GitHub users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchData();
    }
  }, [searchTerm, page, pageSize]);

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleShowSizeChange = (page:number , pageSize: number) => {
    setPage(1);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Input
        placeholder="Search GitHub Users"
        value={searchTerm}
        onChange={handleSearchTermChange}
        suffix={<SearchOutlined />}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <Table
        dataSource={users}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: length,
          onChange: handlePageChange,
          pageSizeOptions: [10, 20, 50], 
          showSizeChanger: true,
          onShowSizeChange:handleShowSizeChange
        }}
      >
        <Column
          title="Avatar"
          dataIndex="avatar_url"
          key="avatar"
          render={(text) => (
            <img src={text} alt="avatar" style={{ width: 40, height: 40 }} />
          )}
        />
        <Column title="User Name" dataIndex="login" key="login" />
        <Column title="Followers" dataIndex="followers" key="followers" />
      </Table>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Space>
          <Button
            type="primary"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous Page
          </Button>
          <Button type="primary" onClick={() => handlePageChange(page + 1)}>
            Next Page
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default GitHubUserSearch;
