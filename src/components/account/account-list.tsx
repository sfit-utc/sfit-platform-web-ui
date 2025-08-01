"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AccountListItem, AccountFilters } from "@/types/account";
import { useAccounts } from "@/hooks/use-account-service";
import AccountItem from "@/components/account/account-item";
import Loading from "@/components/ui/loading";
import SearchBar from "@/components/ui/search-bar";
import AddAccount from "@/components/account/add-account";
export default function AccountList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage, setAccountsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [activeStyle, setActiveStyle] = useState("line");
  const [addAccount, setAddAccount] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Memoize filters to prevent unnecessary re-renders
  const filters: AccountFilters = useMemo(
    () => ({
      search: searchTerm || undefined,
      role: filterRole !== "all" ? filterRole : undefined,
      team: filterTeam !== "all" ? filterTeam : undefined,
    }),
    [searchTerm, filterRole, filterTeam]
  );

  const { data: accounts, loading, error } = useAccounts(filters);

  const totalItems = accounts.length;
  const totalPages = Math.ceil(totalItems / accountsPerPage);
  const startIdx = (currentPage - 1) * accountsPerPage;
  const endIdx = startIdx + accountsPerPage;
  const currentPageData = accounts.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleClick = useCallback(
    (val: string) => {
      setActiveStyle(val);
    },
    [activeStyle]
  );

  const changeAccountsPerPage = useCallback(
    (val: number) => {
      setAccountsPerPage(val);
    },
    [accountsPerPage]
  );

  const AccountItemSkeleton = () => (
    <div className="flex justify-between items-center p-4 border-2 my-2 animate-pulse">
      <div className="h-6 w-1/12 bg-gray-300 rounded"></div>
      <div className="h-6 w-3/12 bg-gray-300 rounded ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-6 w-1/12 bg-gray-300 rounded ml-4"></div>
    </div>
  );

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="">
      <div className="my-5 py-2 flex justify-between">
        <div className="flex *:mx-2">
          <div className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center">
            <div
              className="w-36 h-5 justify-center text-white text-sm font-bold font-inter"
              onClick={() => setAddAccount(true)}
            >
              + Thêm người dùng
            </div>
          </div>

          <SearchBar
            placeholder="Tra theo tên"
            onSearch={handleSearchChange}
            className="w-96"
          />

          <div className="*:text-green-700 flex justify-center items-center">
            <div
              className="mx-2 cursor-pointer rounded-full hover:bg-green-700 hover:text-white"
              onClick={handlePreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left-icon lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
            <div className="text-lg flex whitespace-nowrap">
              <input
                type="text"
                name=""
                id=""
                className="w-6 rounded-md border-1 mr-1 text-center"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const pageNumber = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    handlePageChange(pageNumber);
                  }
                }}
              />
              <span> / {totalPages}</span>
            </div>
            <div
              className="mx-2 cursor-pointer rounded-full hover:bg-green-700 hover:text-white"
              onClick={handleNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right-icon lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>

          <div className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <rect width="19" height="19" fill="url(#pattern0_1070_141)" />
              <defs>
                <pattern
                  id="pattern0_1070_141"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1070_141" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1070_141"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAClklEQVR4nO3coWtWYRiG8UdFREUYCAaDIILBYrFYBGVJECxqMxltyxPBZlu0rZmWtCyZViwrC4ahEwafMBAmMqfOXXLghIPNb+d8z/2+5/79Bec9F3sHu9mJMDMz6xnwEJhgfWve6YNpgjjGcCbTBLEBOYgYBxHjIGIcRIyDVBBkK/uhK7Y1TZB54Gf2k1eoeafz/x2kjXIf+J19goocAI+mitGJ8hj4k32SChwCT44UoxPlafZpKrDQS4xOlGfZJyrYYq8xOlFeZp+sQEuDxGiDHANeZZ+wIMvNOxssSBvlOPA6+6QFWAFODBqjE+Uk8Cb7xMJWgVMzidGJchp4l31yQWvA2ZnG6EQ5B7zPfgNC1oG5lBidKHPtg4zdBnA+FAAXgA+M1yZwMZQAl4DPjM82cDkUAVeBL4zHDnAtlAHXga/Ubxe4ESUAbgLfqdcecCtK0g5c+9TnF3A3SlThwHVw5IEpW0UD12FvA1O2SgauhahJ4QPXYtSo0IFrKWpV4MC1PPjAlK2ggWtlZgNTtgIGrtWZD0zZhAeutbSBKZvgwLWePjBlExq4NmQGpmwCA9em3MA04oFrW3ZgGuHAtSM/MI1o4NotZmAawcC1V9zAlA243f6y7Vvzr3p3ss9nZmY2Ggws+3zFwUG04CBacBAtOIgWHEQLDqIFB9GCg2jBQbTgIFpwEC04iBYcRAsOogUH0YKDaMFBtOAgWnAQLTiIFhxECw6iBQfRgoNowUG04CBacBAtOIgWHEQL8HHIJtnnK/V7jfsOIgS4Arz1T4gY4F7fV1j2mWr5nNNz4IeDVHiNhWldY2Fa11iY1jUWpnWNhWldY2Fa11hY6p9gPv3TY+IeiYAzwIv2o2jfmkgOYmZmUZm/eQ9AEjFMSuEAAAAASUVORK5CYII="
                />
              </defs>
            </svg>

            <div
              className="w-36 h-5 justify-center ml-2 text-white text-base font-bold font-inter"
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              Lựa chọn
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="11"
              viewBox="0 0 18 11"
              fill="none"
            >
              <path
                d="M9.71074 10.2819C9.3194 10.6773 8.6806 10.6773 8.28926 10.2819L0.293676 2.20345C-0.331285 1.57201 0.115997 0.5 1.00442 0.5L16.9956 0.5C17.884 0.5 18.3313 1.57201 17.7063 2.20345L9.71074 10.2819Z"
                fill="white"
              />
            </svg>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div
                ref={filterDropdownRef}
                className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg z-50 p-4"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--foreground)",
                }}
              >
                <div className="mb-3">
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--sfit-green)" }}
                  >
                    Chức vụ
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => {
                      setFilterRole(e.target.value);
                      setShowFilterDropdown(false);
                    }}
                    className="border p-1 rounded w-full"
                    style={{
                      color: "var(--foreground)",
                      backgroundColor: "var(--background)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                  >
                    <option value="all">Tất cả chức vụ</option>
                    <option value="Người dùng">Người dùng</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Người kiểm duyệt">Người kiểm duyệt</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--sfit-green)" }}
                  >
                    Ban
                  </label>
                  <select
                    value={filterTeam}
                    onChange={(e) => {
                      setFilterTeam(e.target.value);
                      setShowFilterDropdown(false);
                    }}
                    className="border p-1 rounded w-full"
                    style={{
                      color: "var(--foreground)",
                      backgroundColor: "var(--background)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                  >
                    <option value="all">Tất cả ban</option>
                    <option value="Học tập">Học tập</option>
                    <option value="Hậu cần">Hậu cần</option>
                    <option value="Đối ngoại">Đối ngoại</option>
                    <option value="Truyền thông">Truyền thông</option>
                    <option value="Kỹ thuật">Kỹ thuật</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="IOT">IOT</option>
                    <option value="Game">Game</option>
                    <option value="Web">Web</option>
                    <option value="Chuyên môn">Chuyên môn</option>
                    <option value="Cán sự">Cán sự</option>
                    <option value="Chủ nhiệm">Chủ nhiệm</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <div
            className="cursor-pointer flex items-center justify-center w-16 h-9 bg-white rounded-tl-[20px] rounded-bl-[20px] border-black border-1"
            onClick={() => {
              handleClick("line");
              changeAccountsPerPage(10);
            }}
            style={{
              backgroundColor: "var(--search-bg)",
            }}
          >
            {activeStyle == "line" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
              >
                <rect width="23" height="23" fill="url(#pattern0_1070_137)" />
                <defs>
                  <pattern
                    id="pattern0_1070_137"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_137" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_137"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACFklEQVR4nO3cP2pVQRSA8UHMHCT+QeIKBGEKzxklQSxtbdyAK7C2M4ULsLQXUQLyZmJj5xYSMKXuwQ0EEpS5CajEkNzivjm8+/1gCAQCQ743lzdw3gsBAAAAAAAAAAAAAAAAAACvXocrvbcwe48+hptW4lsr8WeucpyL/LAqL2b/j+khfb6xYVW+5Sq//rPedNnUrGMUOTgnRlvHtrt2v/c+ZyFdHGNYVuPL3ntdeemSMdrSEl/13u9K051wO1fZv0yMYRV50nvPKyuNOBnD46rEr7wNdhNDDtrfTLWfWdORj6kWY3Pn+p3e+15JSgw/iOGIcjL8UGL4ocTwQ4nhhxLDDyWGH0oMP5QYfigx/FBi+KHE8EOJ4YcSww8lhh9KDD+UGH4oMfxQYpx4WK5u5SKfcpXvVmUv17j9eBGuLTNGYjrk9FW5G5/lKodnRyllb1njMIkYJ9opOB3F7zajlIjxh5b4tOfgWCLGv/Ji7Xmvab5EjLPaZyB6jFgmYpwvV/myzCiJGBe/91/WMHIixogow/1juqFk5dLnJ4oSw08UJYafKEoMP1GUGH6iKDH8RHlQ4z0+Rjah0XeHKkc9bv+zMvak5InuMpgoihHDz0kxYviJYsTwE8WI4SeKEcNPFCOGn3uKcc/oY3MRblmN7/8aJzq0Gt+1L5nstCU09iGsa5W77efwCwAAAAAAAAAAAAAAEBDCbxTxSbNbOaOZAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <rect width="27" height="27" fill="url(#pattern0_1070_139)" />
              <defs>
                <pattern
                  id="pattern0_1070_139"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1070_139" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1070_139"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABK0lEQVR4nO3cS07DMBQF0EioeWsBVBsWwyZri98I2BSCzjoJMhILaNQojjhH8gbeje0MbjIMAAAAAAAA/1guu9tc4jXV+Mo1Jitmz+B3hiVe7g7jzaww9ofdPtc4CiEu/SAe22zPDiSV8UMYscipkOr4flYYD4fhKtU4CSQWCiRObcYCqRsNxJEVy4ZSxrfzLhCX+rRcGPE961Jv2itaqvGcSnyuvc3zxlebYSrxdP84Xs8KAwAAAAAAAAAA5tF+j8vVgLTfo9el/Z672y3a71Nnx5f2e95yII0PdmK5ULTfo6MwtN+n1UPQfgcAAAAAAAAAYD3a73HJtqJ/v+c+l/Z77m63aL9PnR1f2u95y4E02u+xXCja79FRGNrv0+ohaL8DAAAAAAAMf34ANOZZwo61A5UAAAAASUVORK5CYII="
                />
              </defs>
            </svg>
          </div>
          <div
            className="cursor-pointer flex items-center justify-center w-16 h-9 bg-white rounded-tr-[20px] rounded-br-[20px] border-black border-1"
            onClick={() => {
              handleClick("box");
              changeAccountsPerPage(9);
            }}
            style={{
              backgroundColor: "var(--search-bg)",
            }}
          >
            {activeStyle == "box" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
              >
                <rect width="23" height="23" fill="url(#pattern0_1070_137)" />
                <defs>
                  <pattern
                    id="pattern0_1070_137"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_137" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_137"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACFklEQVR4nO3cP2pVQRSA8UHMHCT+QeIKBGEKzxklQSxtbdyAK7C2M4ULsLQXUQLyZmJj5xYSMKXuwQ0EEpS5CajEkNzivjm8+/1gCAQCQ743lzdw3gsBAAAAAAAAAAAAAAAAAACvXocrvbcwe48+hptW4lsr8WeucpyL/LAqL2b/j+khfb6xYVW+5Sq//rPedNnUrGMUOTgnRlvHtrt2v/c+ZyFdHGNYVuPL3ntdeemSMdrSEl/13u9K051wO1fZv0yMYRV50nvPKyuNOBnD46rEr7wNdhNDDtrfTLWfWdORj6kWY3Pn+p3e+15JSgw/iOGIcjL8UGL4ocTwQ4nhhxLDDyWGH0oMP5QYfigx/FBi+KHE8EOJ4YcSww8lhh9KDD+UGH4oMfxQYpx4WK5u5SKfcpXvVmUv17j9eBGuLTNGYjrk9FW5G5/lKodnRyllb1njMIkYJ9opOB3F7zajlIjxh5b4tOfgWCLGv/Ji7Xmvab5EjLPaZyB6jFgmYpwvV/myzCiJGBe/91/WMHIixogow/1juqFk5dLnJ4oSw08UJYafKEoMP1GUGH6iKDH8RHlQ4z0+Rjah0XeHKkc9bv+zMvak5InuMpgoihHDz0kxYviJYsTwE8WI4SeKEcNPFCOGn3uKcc/oY3MRblmN7/8aJzq0Gt+1L5nstCU09iGsa5W77efwCwAAAAAAAAAAAAAAEBDCbxTxSbNbOaOZAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#15803d"
              className="lucide lucide-layout-grid-icon lucide-layout-grid"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
        </div>
      </div>
      {activeStyle === "line" ? (
        <div className="flex flex-col w-full">
          <div
            className="flex justify-between items-center py-4  my-2 font-bold"
            style={{
              color: "var(--foreground)",
            }}
          >
            <div className="flex-2 text-center">STT</div>
            <div className="flex-5 text-center">HỌ VÀ TÊN</div>
            <div className="flex-3 text-center">BAN</div>
            <div className="flex-3 text-center">CHỨC VỤ</div>
            <div className="flex-2 text-center">LỚP - KHÓA</div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center"></div>
            <div className="flex-1 text-center"></div>
          </div>
          {loading
            ? [...Array(5)].map((_, i) => <AccountItemSkeleton key={i} />)
            : currentPageData.map((account) => (
                <AccountItem key={account.id} account={account} style="line" />
              ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {loading
            ? [...Array(6)].map((_, i) => <AccountItemSkeleton key={i} />)
            : currentPageData.map((account) => (
                <AccountItem key={account.id} account={account} style="box" />
              ))}
        </div>
      )}

      <AddAccount state={addAccount} funcClickToBack={setAddAccount} />
    </div>
  );
}
