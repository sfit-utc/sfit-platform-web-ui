import { Account, AccountStats, AccountListItem, AccountFilters, ApiError } from "@/types/account";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class AccountService {
  async getAccountStats(): Promise<AccountStats> {
    return {
      totalUsers: 99,
      activeUsers: 70,
      leaders: 30,
      newUsers: 0,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/account/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy thống kê tài khoản");
      }

      return response.json();
    } catch (error) {
      console.error("get account stats error: ", error);
      throw error;
    }
  }

  async getAccounts(filters?: AccountFilters): Promise<AccountListItem[]> {
    const mockAccounts: AccountListItem[] = [
      {
        id: 1,
        name: "Nguyễn Thị Quỳnh",
        role: "Quản trị viên",
        class: "CNTT-K65",
        teams: ["Web", "IOT"],
        avatar: "/avatars/user1.jpg",
        lastActive: "2 phút trước",
      },
      {
        id: 2,
        name: "Trần Văn Minh",
        role: "Người kiểm duyệt",
        class: "CNTT-K64",
        teams: ["Chuyên môn"],
        avatar: "/avatars/user2.jpg",
        lastActive: "10 phút trước",
      },
      {
        id: 3,
        name: "Lê Thị Hồng",
        role: "Người dùng",
        class: "CNTT-K66",
        teams: ["Sự kiện", "Truyền thông"],
        avatar: "/avatars/user3.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 4,
        name: "Phạm Văn Dũng",
        role: "Người dùng",
        class: "CNTT-K67",
        teams: ["Truyền thông"],
        avatar: "/avatars/user4.jpg",
        lastActive: "30 phút trước",
      },
      {
        id: 5,
        name: "Hoàng Thị Mai",
        role: "Người kiểm duyệt",
        class: "CNTT-K68",
        teams: ["Học tập", "Công nghệ"],
        avatar: "/avatars/user5.jpg",
        lastActive: "5 phút trước",
      },
      {
        id: 6,
        name: "Vũ Minh Tuấn",
        role: "Quản trị viên",
        class: "CNTT-K66",
        teams: ["Công nghệ", "Sự kiện", "Truyền thông"],
        avatar: "/avatars/user6.jpg",
        lastActive: "15 phút trước",
      },
      {
        id: 7,
        name: "Đặng Thị Lan",
        role: "Người dùng",
        class: "CNTT-K65",
        teams: ["Sự kiện"],
        avatar: "/avatars/user7.jpg",
        lastActive: "45 phút trước",
      },
      {
        id: 8,
        name: "Bùi Văn Hòa",
        role: "Người kiểm duyệt",
        class: "CNTT-K67",
        teams: ["Truyền thông", "Học tập"],
        avatar: "/avatars/user8.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 9,
        name: "Ngô Thị Thu",
        role: "Người dùng",
        class: "CNTT-K66",
        teams: ["Học tập"],
        avatar: "/avatars/user9.jpg",
        lastActive: "20 phút trước",
      },
      {
        id: 10,
        name: "Lý Văn Khánh",
        role: "Quản trị viên",
        class: "CNTT-K68",
        teams: ["Công nghệ", "Học tập"],
        avatar: "/avatars/user10.jpg",
        lastActive: "3 phút trước",
      },
      {
        id: 11,
        name: "Hồ Thị Hạnh",
        role: "Người kiểm duyệt",
        class: "CNTT-K67",
        teams: ["Sự kiện"],
        avatar: "/avatars/user11.jpg",
        lastActive: "12 phút trước",
      },
      {
        id: 12,
        name: "Đỗ Văn Phúc",
        role: "Người dùng",
        class: "CNTT-K66",
        teams: ["Truyền thông", "Công nghệ"],
        avatar: "/avatars/user12.jpg",
        lastActive: "8 phút trước",
      },
      {
        id: 13,
        name: "Tô Thị Yến",
        role: "Quản trị viên",
        class: "CNTT-K65",
        teams: ["Học tập", "Sự kiện"],
        avatar: "/avatars/user13.jpg",
        lastActive: "25 phút trước",
      },
      {
        id: 14,
        name: "Dương Văn Sơn",
        role: "Người dùng",
        class: "CNTT-K67",
        teams: ["Công nghệ"],
        avatar: "/avatars/user14.jpg",
        lastActive: "40 phút trước",
      },
      {
        id: 15,
        name: "Mai Thị Hoa",
        role: "Người kiểm duyệt",
        class: "CNTT-K68",
        teams: ["Sự kiện", "Truyền thông", "Học tập"],
        avatar: "/avatars/user15.jpg",
        lastActive: "7 phút trước",
      },
    ];

    let filteredAccounts = mockAccounts;
    if (filters) {
      if (filters.role) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.role.toLowerCase().includes(filters.role!.toLowerCase())
        );
      }
      if (filters.class) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.class.toLowerCase().includes(filters.class!.toLowerCase())
        );
      }
      if (filters.team) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.teams.some(team => 
            team.toLowerCase().includes(filters.team!.toLowerCase())
          )
        );
      }
      if (filters.search) {
        const normalizedSearch = normalizeText(filters.search);
        filteredAccounts = filteredAccounts.filter(account => {
          const normalizedName = normalizeText(account.name);
          const normalizedRole = normalizeText(account.role);
          const normalizedTeams = account.teams.map(team => normalizeText(team));
          const normalizedClass = normalizeText(account.class);
          
          return (
            normalizedName.includes(normalizedSearch) ||
            normalizedRole.includes(normalizedSearch) ||
            normalizedTeams.some(team => team.includes(normalizedSearch)) ||
            normalizedClass.includes(normalizedSearch)
          );
        });
      }
    }

    return filteredAccounts;

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters as Record<string, string>).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString());
        });
      }

      const response = await fetch(`${API_BASE_URL}/accounts?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy danh sách tài khoản");
      }

      return response.json();
    } catch (error) {
      console.error("get accounts error: ", error);
      throw error;
    }
  }

  async getAccountById(id: number): Promise<Account> {
    const mockAccount: Account = {
      id: id,
      name: "Nguyễn Văn A",
      teams: ["Frontend", "UI/UX"],
      role: "Thành viên",
      class: "CNTT-K65",
      email: "nguyenvana@example.com",
      avatar: "/avatars/user1.jpg",
      status: "active",
      joinDate: "01/09/2023",
    };

    return mockAccount;

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy thông tin tài khoản");
      }

      return response.json();
    } catch (error) {
      console.error("get account by id error: ", error);
      throw error;
    }
  }

  async updateAccount(id: number, data: Partial<Account>): Promise<Account> {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể cập nhật tài khoản");
      }

      return response.json();
    } catch (error) {
      console.error("update account error: ", error);
      throw error;
    }
  }

  async deleteAccount(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể xóa tài khoản");
      }
    } catch (error) {
      console.error("delete account error: ", error);
      throw error;
    }
  }
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase();
}

export const accountService = new AccountService();
