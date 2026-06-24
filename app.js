// Bảng quy đổi chữ cái Pythagoras
const pythagoreanMap = {
    'A':1, 'J':1, 'S':1, 'B':2, 'K':2, 'T':2, 'C':3, 'L':3, 'U':3,
    'D':4, 'M':4, 'V':4, 'E':5, 'N':5, 'W':5, 'F':6, 'O':6, 'X':6,
    'G':7, 'P':7, 'Y':7, 'H':8, 'Q':8, 'Z':8, 'I':9, 'R':9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// Hàm loại bỏ dấu tiếng Việt và ký tự đặc biệt
function removeVietnameseTones(str) {
    str = str.toUpperCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/Đ/g, "D");
    return str.replace(/[^A-Z\s]/g, "");
}

// Hàm rút gọn số theo chuẩn Nhân số học (giữ lại 11, 22, 33 nếu cần)
function reduceNumber(num, keepMaster = true) {
    while (num > 9) {
        if (keepMaster && (num === 11 || num === 22 || num === 33)) {
            return num;
        }
        num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
}

// Logic phân tách và tính toán tên (Sứ mệnh, Linh hồn, Nhân cách, Tên gọi)
function analyzeName(nameStr) {
    let cleanName = removeVietnameseTones(nameStr);
    let words = cleanName.trim().split(/\s+/);
    let mainName = words[words.length - 1] || ""; // Lấy phần Tên chính cuối cùng

    let sumSuMenh = 0;
    let sumLinhHon = 0;
    let sumNhanCach = 0;
    let sumTenGoi = 0;

    // Tính chỉ số Tên Gọi riêng biệt
    for (let char of mainName) {
        if (pythagoreanMap[char]) sumTenGoi += pythagoreanMap[char];
    }

    // Tính Sứ mệnh, Linh hồn, Nhân cách toàn bộ họ tên
    for (let word of words) {
        for (let i = 0; i < word.length; i++) {
            let char = word[i];
            let val = pythagoreanMap[char] || 0;
            sumSuMenh += val;

            // Xử lý nguyên âm / phụ âm (Đơn giản hóa chữ Y)
            let isVowel = VOWELS.includes(char);
            if (char === 'Y') {
                // Nếu Y đứng một mình hoặc không có nguyên âm nào bên cạnh thì coi là Nguyên âm
                isVowel = (i === 0 || !VOWELS.includes(word[i-1])) && (i === word.length-1 || !VOWELS.includes(word[i+1]));
            }

            if (isVowel) {
                sumLinhHon += val;
            } else {
                sumNhanCach += val;
            }
        }
    }

    return {
        suMenh: reduceNumber(sumSuMenh),
        linhHon: reduceNumber(sumLinhHon),
        nhanCach: reduceNumber(sumNhanCach),
        tenGoi: reduceNumber(sumTenGoi)
    };
}

// Kho dữ liệu luận giải mẫu (Bạn có thể kéo dài nội dung này ra tùy ý)
const interpretationDatabase = {
    duongDoi: {
        7: "<h4>Năng lượng chuẩn:</h4><p>Khả năng phân tích sâu sắc, tự học, thích chiêm nghiệm...</p><h4>Bài học phát triển:</h4><p>Học cách tin tưởng và chia sẻ trí tuệ...</p>",
        4: "<h4>Năng lượng chuẩn:</h4><p>Thực tế, kỷ luật, chi tiết và tính tổ chức cao...</p>"
    },
    suMenh: {
        3: "<h4>Năng lượng chuẩn:</h4><p>Lan tỏa niềm vui, truyền cảm hứng qua ngôn từ...</p>"
    }
    // Bổ sung linhHon, nhanCach, tenGoi, tenTacY tương tự...
};

let currentResults = {}; // Lưu kết quả tạm thời để hiển thị modal

// Lắng nghe sự kiện submit form
document.getElementById('numerologyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let fullName = document.getElementById('fullName').value;
    let birthDate = document.getElementById('birthDate').value;
    let intentName = document.getElementById('intentName').value;

    if(!birthDate) return;

    // 1. Tính Đường Đời từ ngày sinh
    let digits = birthDate.replace(/-/g, '').split('').map(Number);
    let sumDate = digits.reduce((a, b) => a + b, 0);
    let duongDoi = reduceNumber(sumDate);

    // 2. Tính các chỉ số từ Họ Tên Gốc
    let nameAnalysis = analyzeName(fullName);

    // 3. Tính Tên Tác Ý (nếu có)
    let tenTacY = 0;
    if(intentName.trim() !== "") {
        let intentAnalysis = analyzeName(intentName);
        tenTacY = intentAnalysis.suMenh; // Lấy năng lượng tổng hợp của tên mới làm chỉ số tác ý
    }

    // Lưu kết quả vào biến global để hiển thị khi click
    currentResults = {
        duongDoi: duongDoi,
        suMenh: nameAnalysis.suMenh,
        linhHon: nameAnalysis.linhHon,
        nhanCach: nameAnalysis.nhanCach,
        tenGoi: nameAnalysis.tenGoi,
        tenTacY: tenTacY || "N/A"
    };

    // Đẩy số lên giao diện
    document.getElementById('resDuongDoi').innerText = currentResults.duongDoi;
    document.getElementById('resSuMenh').innerText = currentResults.suMenh;
    document.getElementById('resLinhHon').innerText = currentResults.linhHon;
    document.getElementById('resNhanCach').innerText = currentResults.nhanCach;
    document.getElementById('resTenGoi').innerText = currentResults.tenGoi;
    document.getElementById('resTenTacY').innerText = currentResults.tenTacY;

    // Hiển thị vùng kết quả
    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
});

// Hàm điều khiển Pop-up Modal luận giải chi tiết
function showDetail(type) {
    let num = currentResults[type];
    let titleText = "";
    
    switch(type) {
        case 'duongDoi': titleText = `Đường Đời Số ${num}`; break;
        case 'suMenh': titleText = `Sứ Mệnh Số ${num}`; break;
        case 'linhHon': titleText = `Linh Hồn Số ${num}`; break;
        case 'nhanCach': titleText = `Nhân Cách Số ${num}`; break;
        case 'tenGoi': titleText = `Tên Gợi Số ${num}`; break;
        case 'tenTacY': titleText = `Tên Tác Ý Số ${num}`; break;
    }

    document.getElementById('modalTitle').innerText = titleText;
    
    // Tìm nội dung trong database, nếu không có hiển thị nội dung mặc định
    let content = (interpretationDatabase[type] && interpretationDatabase[type][num]) 
        ? interpretationDatabase[type][num] 
        : "<p>Dữ liệu phân tích chi tiết cho con số này đang được cập nhật thêm nội dung...</p>";
        
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
}
