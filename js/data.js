/**
 * VănHọc12 — Kho Dữ Liệu Tác Phẩm Ngữ Văn Lớp 12 & Luyện Thi THPT Quốc Gia
 * Đầy đủ văn bản trích đoạn chuẩn SGK, toàn bộ bài thơ, dàn ý phân tích 9+, mở bài mẫu và hệ thống phân quyền Admin
 */

// Cấu hình phân quyền mặc định dành cho khách (Do Admin toàn quyền điều khiển)
const DEFAULT_GUEST_PERMISSIONS = {
  canCopyNotes: true,       // Cho phép khách sao chép dẫn chứng
  canListenAudio: true,     // Cho phép khách nghe bình giảng audio
  canAddPersonalNotes: true,// Cho phép khách tạo ghi chú cá nhân của họ
  canBookmarkWorks: true,   // Cho phép khách lưu tủ bài ôn tập
  allowTextSelection: true  // Cho phép khách bôi đen văn bản
};

// Cấu hình hình nền mặc định toàn trang web (Do Admin thiết lập cho tất cả học sinh & người mới vào)
const DEFAULT_SITE_BACKGROUND = {
  customBg: 'https://images.unsplash.com/photo-1507842229458-5777dd623351?auto=format&fit=crop&w=1920&q=80', // Thư viện hoàng hôn ấm áp
  bgOverlay: '70',
  bgBlur: '3'
};

// Mật khẩu Admin mặc định
const DEFAULT_ADMIN_PASSWORD = "Viet09";

// Cấu hình Google Firebase Realtime Database mặc định
// (Khi tải lên GitHub Pages, tất cả người dùng và học sinh sẽ tự động kết nối đám mây)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBFOVfPhX2-hzWHH2clZanbXuF14qB48Y",
  authDomain: "vanhoc-3f624.firebaseapp.com",
  databaseURL: "https://vanhoc-3f624-default-rtdb.firebaseio.com",
  projectId: "vanhoc-3f624",
  storageBucket: "vanhoc-3f624.firebasestorage.app",
  messagingSenderId: "36738133508",
  appId: "1:36738133508:web:36c416cb42ba2f99f48f51",
  measurementId: "G-0P5DY5SGHN"
};

const LITERATURE_WORKS = [
  {
    id: "vo-chong-a-phu",
    title: "Vợ Chồng A Phủ",
    author: "Tô Hoài",
    period: "1952 (Tập 'Truyện Tây Bắc')",
    category: "prose",
    categoryName: "Truyện Ngắn & Ký",
    genre: "Truyện ngắn hiện thực",
    rating: 9.8,
    reviews: 3250,
    readTime: "35 phút",
    progress: 85,
    isFavorite: true,
    isFeatured: true,
    badge: "Trọng tâm thi THPT",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#1e1b4b",
      c2: "#4338ca",
      accent: "#a78bfa",
      gradient: "linear-gradient(135deg, #0f172a 0%, #312e81 60%, #4f46e5 100%)",
      icon: "🏔️"
    },
    summary: "Bức tranh chân thực về số phận đau thương của người nông dân nghèo Tây Bắc dưới ách áp bức của phong kiến thực dân, và ngợi ca sức sống tiềm tàng, khát vọng tự do mãnh liệt của Mị và A Phủ.",
    audioScript: "Vợ chồng A Phủ của nhà văn Tô Hoài là đỉnh cao văn xuôi kháng chiến chống Pháp. Tác phẩm làm nổi bật vẻ đẹp sức sống tiềm tàng của nhân vật Mị trong đêm tình mùa xuân và hành động táo bạo cắt dây cởi trói cho A Phủ trong đêm đông Hồng Ngài.",
    sampleIntro: "Đại thi hào Maxim Gorky từng khẳng định: 'Văn học là nhân học'. Nhà văn Tô Hoài bằng vốn sống phong phú và tấm lòng gắn bó máu thịt với đồng bào vùng cao Tây Bắc đã viết nên 'Vợ chồng A Phủ' – thiên truyện đẫm chất thơ và ánh sáng của lòng nhân đạo cao cả, khám phá sức sống tiềm tàng bất diệt của người phụ nữ vùng cao.",
    fullTextSections: [
      {
        sectionTitle: "Phần I: Thân phận con dâu gạt nợ cay đắng của Mị",
        content: `Ai ở xa về, đến nhà thống lý Pá Tra thường nghe nói: nhà Pá Tra làm nhiều nương, nhiều bạc, nhiều thuốc phiện nhất làng. Nhưng ai cũng để ý đến một cô con gái ngồi quay sợi gai bên tảng đá trước cửa, cạnh tàu ngựa. Lúc nào cũng vậy, dù quay sợi, thái cỏ ngựa, dệt vải, chẻ củi hay đi cõng nước dưới khe suối lên, cô ấy cũng cúi mặt, mặt buồn rười rượi. Người ta thường bảo: cô ấy là con gái nhà Pá Tra hay con dâu nhà ai? Không, cô ấy là vợ A Sử, con trai thống lý Pá Tra.

Cô Mị về làm dâu nhà Pá Tra đã mấy năm. Từ năm nào, cô không nhớ, cũng không ai nhớ. Nhưng những người nghèo ở Hồng Ngài thì vẫn còn kể lại câu chuyện Mị về làm dâu. Ngày xưa, bố Mị lấy mẹ Mị không đủ tiền cưới, phải đến vay nhà thống lý Pá Tra, bố của thống lý Pá Tra bây giờ. Mỗi năm phải trả lãi một nương ngô. Đến khi mẹ Mị chết, bố Mị đã già mà vẫn chưa trả hết nợ. Thống lý bảo: "Cho mày con gái về làm dâu thì tao xóa nợ cho". Bố Mị thương con, bảo: "Tao già rồi, chết thì chết, chứ không bán con". Nhưng Mị bảo bố: "Con nay đã biết cuốc nương làm ngô, con phải làm nương ngô giả nợ thay cho bố. Bố đừng bán con cho nhà giàu".

Thế rồi mùa xuân năm ấy, A Sử đến bắt Mị về làm vợ gạt nợ. Mị về nhà thống lý Pá Tra, những đêm mùa đông Mị chỉ biết ngồi hơ tay bên bếp lửa. Có những đêm Mị khóc, Mị trốn về nhà, quỳ lạy bố, trên tay cầm nắm lá ngón độc. Nhưng nhìn bố già nua Mị không đành chết, Mị ném nắm lá ngón đi rồi trở lại nhà Pá Tra.

Ở lâu trong cái khổ, Mị quen khổ rồi. Bây giờ thì Mị tưởng mình cũng là con trâu, mình cũng là con ngựa, là con ngựa phải đổi ở cái tàu ngựa nhà này đến ở cái tàu ngựa nhà khác, ngựa chỉ biết ăn cỏ, biết đi làm mà thôi. Mị nằm trong căn buồng kín mít, chỉ có một chiếc cửa sổ một lỗ vuông bằng bàn tay, trông ra chỉ thấy trăng trắng, không biết là sương hay là nắng.`
      },
      {
        sectionTitle: "Phần II: Sức sống tiềm tàng trỗi dậy trong đêm tình mùa xuân",
        content: `Hồng Ngài năm ấy ăn Tết giữa lúc gió thổi vào cỏ gianh vàng ửng, gió rét dữ dội. Nhưng trong các làng Mông, váy hoa đã đem ra phơi trên mỏm đá xòe như con bướm sặc sỡ. Đám trẻ con đợi tết, chơi quay, cười ầm trên sân chơi trước nhà.

Ngoài đầu núi đã có tiếng ai thổi sáo rủ bạn đi chơi. Mị nghe tiếng sáo lửng lơ bay ngoài đường:
"Mày có con trai con gái rồi
Mày đi làm nương
Ta chưa có con trai con gái
Ta đi tìm người yêu..."

Tiếng sáo tha thiết bồi hồi. Mị ngồi trong buồng, Mị cũng nghe tiếng sáo. Ngày trước Mị thổi sáo giỏi, Mị uốn chiếc lá trên môi, thổi lá cũng hay như thổi sáo. Mị thấy phơi phới trở lại, trong lòng đột nhiên vui sướng như những đêm Tết ngày trước. Mị trẻ lắm. Mị vẫn còn trẻ. Mị muốn đi chơi. Bao nhiêu người có vợ có chồng cũng đi chơi ngày Tết. Huống chi Mị với A Sử không có lòng với nhau mà vẫn phải ở với nhau!

Mị lén lấy hũ rượu, cứ uống ực từng bát. Rồi say, Mị lịm mặt ngồi đấy nhìn mọi người nhảy đồng, người hát, nhưng lòng Mị thì đang sống về ngày trước. Mị đến góc nhà, lấy ống mỡ, xắn một miếng bỏ thêm vào đĩa đèn cho sáng. Mị quấn lại tóc, với tay lấy cái váy hoa vắt ở phía trong vách.

A Sử bước vào, thấy Mị sửa soạn đi chơi. Nó hỏi: "Mày muốn đi chơi à?". Mị không nói. A Sử bước lại, nắm Mị, lấy thắt lưng trói hai tay Mị. Nó xách cả một thúng sợi đay ra trói đứng Mị vào cột nhà. Tóc Mị xõa xuống, A Sử quấn luôn tóc lên cột, làm cho Mị không cúi, không nghiêng được đầu nữa. Trói xong, A Sử tắt đèn, đi ra ngoài khép cửa buồng lại.

Trong bóng tối, Mị đứng im như không biết mình đang bị trói. Mị vẫn nghe tiếng sáo đưa Mị đi theo những cuộc chơi, những đám chơi. "Em không yêu, quả pao rơi rồi / Em bãi pao tìm ai...". Mị vùng bước đi, nhưng chân tay đau buốt không cựa được. Mị sực tỉnh, nhớ ra mình đang bị trói đứng vào cột...`
      },
      {
        sectionTitle: "Phần III: Đêm mùa đông cởi trói cứu A Phủ và tự giải phóng",
        content: `Mùa đông trên núi cao dài và buồn. Những đêm mùa đông trên núi cao, Mị thường dậy ngồi thổi lửa sưởi tay. Lửa bùng lên, Mị nhìn sang bên kia thấy A Phủ cũng đang bị trói đứng vào cọc bằng dây mây, quấn từ chân lên đến vai, suốt mấy ngày đêm rồi.

Ban đầu, Mị vẫn thản nhiên. Nếu A Phủ là cái xác chết đứng đấy, Mị cũng thế thôi. Mị quen nhìn cảnh ấy rồi. Nhưng đêm nay, ngọn lửa le lói chiếu sang, Mị lé mắt trông sang, thấy một dòng nước mắt lấp lánh bò xuống hai hõm má đã xám đen lại của A Phủ.

Thấy giọt nước mắt ấy, Mị chợt nhớ lại đêm năm trước A Sử trói Mị, Mị cũng phải trói đứng thế kia, nước mắt chảy xuống miệng, xuống cổ không lau đi được. Trời ơi, nó bắt trói đứng người ta đến chết! Chúng nó thật độc ác! Cơ chừng này chỉ đêm nay hoặc ngày mai là người kia chết mất, chết đau, chết đói, chết rét, phải chết oan uổng. Mị nghĩ: ta là thân đàn bà nó đã cúng trình ma nhà nó rồi thì chỉ biết đợi ngày rũ xương ở đây thôi... Nhưng người kia việc gì mà phải chết thế?

Nghĩ thế, Mị rón rén bước lại gần đống lửa, lấy con dao nhỏ gọt củi vót sợi mây. Mị run run cắt từng nút dây mây cho A Phủ. Cắt xong nút cuối cùng, Mị hốt hoảng thì thào: "Đi ngay!".

A Phủ khuỵu xuống không đứng nổi, nhưng trước cái chết đang cận kề, A Phủ quật sức vùng lên, chạy vụt ra bóng tối. Mị đứng lặng trong bóng tối. Gió buốt thổi qua kẽ vách. Trong giây phút nghẹt thở ấy, Mị vụt chạy theo A Phủ. Trời tối đen như mực. Mị vừa chạy vừa thở hồng hộc, đuổi kịp A Phủ, Mị nói trong hơi thở:
"A Phủ cho tôi đi! Ở đây thì chết mất!"

Thế rồi hai người lẳng lặng dìu nhau băng qua dốc núi, trốn khỏi Hồng Ngài sang khu du kích Phiềng Sa tìm con đường giải phóng.`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Bi kịch con dâu gạt nợ & Sự tha hóa thân phận",
        lead: "Tô Hoài vạch trần sức mạnh hủy diệt của cường quyền phong kiến và thần quyền hủ tục nhà thống lý Pá Tra.",
        paragraphs: [
          "Mị mở đầu tác phẩm bằng hình ảnh đối lập đầy ám ảnh: giữa cảnh giàu sang nứt đố đổ vách của nhà thống lý, Mị lại 'ngồi quay sợi gai bên tảng đá trước cửa, cạnh tàu ngựa, lúc nào cũng cúi mặt, mặt buồn rười rượi'. Tảng đá câm nín và con ngựa quần quật phản chiếu kiếp sống nô lệ của Mị.",
          "Căn buồng Mị nằm chỉ có một ô cửa sổ nhỏ vuông bằng bàn tay, trông ra chỉ thấy 'trăng trắng không biết là sương hay là nắng'. Đó không đơn thuần là không gian sinh hoạt mà là ngục thất tinh thần giam hãm tuổi trẻ, làm tê liệt ý niệm không gian và thời gian của nhân vật.",
          "Mị cam chịu đến mức 'ở lâu trong cái khổ, Mị quen khổ rồi', coi mình như con trâu, con ngựa chỉ biết làm quần quật cả năm cả đời."
        ],
        highlight: {
          title: "Ý nghĩa hiện thực:",
          text: "Nhà văn lên án đanh thép giai cấp thống trị miền núi đã dùng đồng tiền và hủ tục cúng ma để cướp đoạt tự do và bóp nghẹt quyền sống của con người."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Sức sống tiềm tàng đêm tình mùa xuân",
        lead: "Men rượu ngày Tết và tiếng sáo gọi bạn tình đánh thức ký ức tuổi xuân và khát vọng sống mãnh liệt.",
        paragraphs: [
          "Thiên nhiên Tây Bắc rực rỡ sắc màu với những chiếc váy hoa xòe như cánh bướm trên mỏm đá, cùng tiếng sáo tha thiết đã lay động tâm hồn Mị. Mị uống rượu 'ực từng bát' như nuốt trọn uất hận bấy lâu.",
          "Hơi men đưa Mị bừng tỉnh: 'Mị thấy mình còn trẻ. Mị còn trẻ lắm. Mị muốn đi chơi!'. Đây là tuyên ngôn mãnh liệt đòi quyền sống, quyền được hạnh phúc của một con người đã bị chôn vùi trong bóng tối.",
          "Dù bị A Sử trói đứng vào cột bằng cả thúng sợi đay, thể xác bị giam cầm nhưng tâm hồn Mị vẫn bay bổng theo tiếng sáo rủ bạn đi chơi. Khát vọng tự do mạnh hơn cả xiềng xích bạo tàn."
        ],
        highlight: {
          title: "Bậc thầy miêu tả tâm lý:",
          text: "Sức sống của Mị như hòn than hồng ủ kín dưới tro tàn, chỉ cần một làn gió xuân mát lành là bùng lên ngọn lửa khao khát mãnh liệt."
        }
      },
      {
        id: "chap-3",
        title: "Luận điểm 3: Hành động cắt dây cởi trói và tự giải thoát",
        lead: "Giọt nước mắt của A Phủ và bước ngoặt chuyển biến từ lòng thương người đến hành động cách mạng tự giải phóng.",
        paragraphs: [
          "Từ chỗ thản nhiên vô cảm trước cái chết của A Phủ, giọt nước mắt 'lấp lánh bò xuống hai hõm má xám đen' của A Phủ đã kích hoạt lòng trắc ẩn của Mị. Mị nhớ lại chính mình từng chịu đòn trói oan nghiệt và thấu hiểu nỗi đau đồng loại.",
          "Tình thương người đã chiến thắng nỗi sợ hãi cái chết. Mị rút dao cắt đứt từng nút dây mây cứu sống A Phủ.",
          "Khi A Phủ chạy vụt đi, Mị đứng lặng giữa ranh giới sinh tử, rồi bừng ngộ vụt chạy theo: 'A Phủ cho tôi đi! Ở đây thì chết mất!'. Đó là hành động tự cứu lấy cuộc đời mình theo quy luật tất yếu 'ở đâu có áp bức, ở đó có đấu tranh'."
        ],
        highlight: {
          title: "Giá trị nhân đạo cao cả:",
          text: "Tô Hoài không để nhân vật dừng lại ở bế tắc buông xuôi mà mở ra con đường đến với ánh sáng tự do và cách mạng giải phóng dân tộc."
        }
      }
    ]
  },
  {
    id: "vo-nhat",
    title: "Vợ Nhặt",
    author: "Kim Lân",
    period: "1954 (Bối cảnh nạn đói 1945)",
    category: "prose",
    categoryName: "Truyện Ngắn & Ký",
    genre: "Truyện ngắn hiện thực",
    rating: 9.7,
    reviews: 2890,
    readTime: "30 phút",
    progress: 90,
    isFavorite: true,
    isFeatured: false,
    badge: "Bài ca tình người",
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#78350f",
      c2: "#d97706",
      accent: "#f59e0b",
      gradient: "linear-gradient(135deg, #451a03 0%, #b45309 60%, #f59e0b 100%)",
      icon: "🌾"
    },
    summary: "Đặt con người bên bờ vực cái chết của nạn đói năm Ất Dậu 1945, Kim Lân không miêu tả sự tuyệt vọng mà làm sáng bừng lên vẻ đẹp tình thương, lòng cưu mang và niềm tin bất diệt vào tương lai.",
    audioScript: "Vợ Nhặt của nhà văn Kim Lân là bài ca cảm động về tình người trong nạn đói khủng khiếp năm 1945. Nhân vật Tràng thô kệch nhặt được vợ chỉ bằng bốn bát bánh đúc và vài câu hò vui, nhưng chính đám cưới kỳ lạ ấy đã thắp lên ngọn lửa hy vọng giữa bóng tối của cõi chết.",
    sampleIntro: "Viết về nạn đói năm 1945, Nam Cao xót xa nhìn thấy sự tha hóa nhân cách vì miếng ăn, nhưng với Kim Lân, ngòi bút của ông lại nâng niu từng đốm lửa sự sống: 'Khi đứng bên bờ vực cái chết, người ta không nghĩ đến cái chết mà chỉ nghĩ đến sự sống'. 'Vợ nhặt' chính là bài ca tuyệt đẹp về tình mẫu tử, tình vợ chồng và khát vọng sống bất diệt.",
    fullTextSections: [
      {
        sectionTitle: "Phần I: Bức tranh nạn đói và cảnh Tràng dẫn vợ về xóm ngụ cư",
        content: `Cái đói đã tràn đến xóm này tự lúc nào. Những gia đình từ những vùng Nam Định, Thái Bình, đội chiếu lũ lượt bồng bế, dắt díu nhau lên xanh xám như những bóng ma, và nằm ngổn ngang khắp lều chợ. Người chết như ngả rạ. Không buổi sáng nào người trong làng đi chợ, đi làm đồng không gặp ba bốn cái thây nằm còng queo bên đường. Không khí vẩn lên mùi ẩm mốc của rác rưởi và mùi thối của thây người.

Giữa cái cảnh tối sầm lại vì đói khát ấy, một buổi chiều người trong xóm ngụ cư bỗng thấy Tràng về với một người đàn bà. Tràng đi trước, người đàn bà cắp cái thúng con đi sau. Mặt Tràng có một vẻ gì phởn phơ khác thường. Hắn tủm tỉm cười một mình và hai mắt thì sáng lên lấp lánh. Người đàn bà bước theo sau, đầu hơi cúi xuống, cái nón rách tàng nghiêng nghiêng che khuất đi nửa mặt.

Lũ trẻ con trong xóm ùa ra trêu: "Chông vợ hài!". Người lớn trong xóm ngó ra, thầm thì: "Ai đấy nhỉ?... Hay là người dưới quê mới lên?... Giời đất này còn rước cái của nợ đời ấy về...". Nhưng rồi trong ánh mắt họ ánh lên một nụ cười rạng rỡ, cái gì đó tươi vui, làm sáng lên khuôn mặt u ám thường ngày.`
      },
      {
        sectionTitle: "Phần II: Nguồn gốc 'nhặt' vợ và tâm trạng bà cụ Tứ",
        content: `Vợ Tràng là ai? Hắn nhặt được vợ thật. Hôm ấy Tràng đẩy xe thóc liên đoàn lên tỉnh. Mệt quá, hắn hò chơi một câu:
"Muốn ăn cơm trắng mấy giò này
Lại đây mà đẩy xe bò với anh, nì!"

Chủ ý hắn chỉ hò cho đỡ mệt. Thế rồi một người đàn bà từ đám người đói ton ton chạy lại đẩy xe cho hắn. Người đàn bà gầy sọp, áo quần rách như tổ đỉa, khuôn mặt lưỡi cày xám xịt chỉ còn thấy hai con mắt trũng hoáy. Lần thứ hai gặp lại ở chợ, thị sưng sỉa đòi ăn. Tràng vỗ túi bảo: "Ăn gì thì ăn!". Thế là thị sà xuống ăn liền một chặp bốn bát bánh đúc chẳng chuyện trò gì. Ăn xong thị quẹt miệng thở phào. Tràng cười bảo: "Này nói đùa chứ có về với tớ thì ra khuân đồ lên xe rồi cùng về". Thế mà thị về thật!

Tối ấy, bà cụ Tứ về muộn. Thấy người đàn bà lạ chào bằng u, bà cụ ngơ ngác không hiểu. Tràng phân trần: "Nhà tôi nó mới về làm bạn với tôi đấy u ạ...". Bà lão cúi đầu nín lặng. Bà hiểu rồi. Lòng người mẹ nghèo nghẹn lại, vừa ai oán vừa xót thương cho số kiếp đứa con mình. Người ta có gặp bước khó khăn đói khát này mới chịu lấy đến con mình, mà con mình mới có được vợ. Bà lau giọt nước mắt rỉ ra ở đuôi mắt mờ đục, khẽ bảo nàng dâu: "Ừ, thôi thì các con đã phải duyên phải kiếp với nhau, u cũng mừng lòng...".`
      },
      {
        sectionTitle: "Phần III: Bữa cơm ngày đói và lá cờ đỏ sao vàng",
        content: `Sáng hôm sau, mặt trời lên bằng con sào, Tràng mới trở dậy. Trong nhà, quang cảnh thật quang đãng, sạch sẽ. Mẹ và vợ đang quét dọn sân vườn. Người đàn bà hôm nay hiền hậu, đúng mực, chẳng còn vẻ chao chát chỏng lỏn như hôm trước. Tràng thấy mình bỗng nhiên nên người, thấy có trách nhiệm gắn bó với cái nhà này.

Bữa cơm đón dâu mới thật thảm hại: một lùm rau chuối thái rối, một đĩa muối hạt và một nồi cháo loãng. Nhưng cả nhà ăn rất vui vẻ. Bà cụ Tứ vừa ăn vừa tính chuyện nuôi đàn gà: "Ngoảnh đi ngoảnh lại chẳng mấy mà có đàn gà cho mà xem...".

Đến cuối bữa, bà lão hồ hởi bưng lên một nồi bốc khói nghi ngút: "Chè khoán đây, ngon đáo để cơ!". Nhưng mở vung ra, đó là nồi cháo cám đắng chát, nghẹn bứ ở cổ họng. Tiếng trống thúc thuế dồn dập ngoài đình vang lên rền rĩ. Người vợ nhặt nói: "Trên mạn Thái Nguyên, Bắc Giang, người ta không chịu đóng thuế nữa, người ta đi phá kho thóc của Nhật chia cho người đói...".

Trong óc Tràng bỗng hiện lên hình ảnh đoàn người đói ầm ầm kéo nhau đi trên đê Sộp, phía trước là lá cờ đỏ sao vàng bay phấp phới...`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Tình huống truyện 'nhặt vợ' độc đáo & éo le",
        lead: "Sự rẻ rúng của thân phận con người và sự đâm chồi kỳ diệu của hạnh phúc gia đình.",
        paragraphs: [
          "Giữa nạn đói khủng khiếp năm 1945 khi mạng người như cỏ rác, Tràng 'nhặt' được vợ chỉ sau vài câu đùa vu vơ và bốn bát bánh đúc. Người vợ nhặt theo Tràng không phải vì hám của mà vì khát khao bấu víu lấy sự sống.",
          "Tình huống truyện vừa bi hài vừa xúc động: nó gây ngạc nhiên cho người dân xóm ngụ cư, cho bà cụ Tứ và cho chính bản thân Tràng. Đám cưới không trầu cau, không sính lễ nhưng thắp sáng niềm hy vọng xua tan bóng tối tử thần."
        ],
        highlight: {
          title: "Nghệ thuật xây dựng tình huống:",
          text: "Một tình huống éo le nhưng giàu tính nhân bản, đặt sự sống đối chọi trực diện với cái chết để khẳng định sức sống con người."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Tấm lòng bao dung và tình mẫu tử của bà cụ Tứ",
        lead: "Bức tượng đài tình mẹ đẫm nước mắt xót thương và niềm lạc quan hướng về tương lai.",
        paragraphs: [
          "Bà cụ Tứ đón nhận nàng dâu bằng nỗi xót xa khôn cùng: 'Vừa ai oán vừa xót thương cho số kiếp đứa con mình'. Bà khóc vì thương con, khóc vì tủi phận người mẹ nghèo không lo nổi cho con một đám cưới trọn vẹn.",
          "Câu nói 'Người ta có gặp bước khó khăn này, người ta mới lấy đến con mình' chứa đựng triết lý nhân đạo sâu sắc của người lao động: cưu mang, sẻ chia và trân trọng hạnh phúc con trẻ.",
          "Nồi cháo cám đắng chát nghẹn nghèo trong bữa cơm đầu tiên vẫn ấm áp tiếng cười và niềm tin vào đàn gà tương lai."
        ],
        highlight: {
          title: "Vẻ đẹp tâm hồn người mẹ:",
          text: "Bà cụ Tứ là biểu tượng của người mẹ Việt Nam: chắt chiu sự sống từ cái chết, gieo mầm hy vọng giữa bão giông cuộc đời."
        }
      }
    ]
  },
  {
    id: "tay-tien",
    title: "Tây Tiến",
    author: "Quang Dũng",
    period: "1948 (Viết tại làng Phù Lưu Chanh)",
    category: "poetry",
    categoryName: "Thơ Ca Kháng Chiến",
    genre: "Thơ ca lãng mạn bi tráng",
    rating: 9.9,
    reviews: 3100,
    readTime: "25 phút",
    progress: 100,
    isFavorite: true,
    isFeatured: false,
    badge: "Kiệt tác thơ kháng chiến",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#581c87",
      c2: "#7e22ce",
      accent: "#c084fc",
      gradient: "linear-gradient(135deg, #3b0764 0%, #6b21a8 60%, #c084fc 100%)",
      icon: "🎖️"
    },
    summary: "Khúc tráng ca hào hùng và bi tráng ngợi ca vẻ đẹp thiên nhiên miền Tây hiểm trở, trữ tình và hình tượng người lính Tây Tiến hào hoa, dũng cảm, sẵn sàng hiến dâng tuổi thanh xuân cho Tổ quốc.",
    audioScript: "Tây Tiến của Quang Dũng là một trong những kiệt tác thơ kháng chiến chống Pháp. Bằng cảm hứng lãng mạn và ngòi bút tài hoa bi tráng, nhà thơ đã tái hiện sinh động đoàn quân Tây Tiến hào hoa vượt qua muôn vàn gian khổ để bảo vệ biên cương của non sông đất nước.",
    sampleIntro: "Nhà phê bình Vũ Quần Phương từng viết: 'Quang Dũng đứng riêng một góc trời thơ, một góc trời tài hoa và lãng mạn'. Thi phẩm 'Tây Tiến' ra đời vào thời khắc lịch sử thiêng liêng năm 1948 tại Phù Lưu Chanh, là đóa hoa rừng nở muộn nhưng ngát hương, tạc nên bức tượng đài bất tử về người lính vệ quốc thời đầu kháng chiến chống Pháp.",
    fullTextSections: [
      {
        sectionTitle: "Toàn văn bài thơ Tây Tiến — Quang Dũng (Bản chuẩn SGK)",
        content: `Sông Mã xa rồi Tây Tiến ơi!
Nhớ về rừng núi nhớ chơi vơi
Sài Khao sương lấp đoàn quân mỏi
Mường Lát hoa về trong đêm hơi

Dốc lên khúc khuỷu dốc thăm thẳm
Heo hút cồn mây súng ngửi trời
Ngàn thước lên cao, ngàn thước xuống
Nhà ai Pha Luông mưa xa khơi

Anh bạn dãi dầu không bước nữa
Gục lên súng mũ bỏ quên đời!
Chiều chiều oai linh thác gầm thét
Đêm đêm Mường Hịch cọp trêu người

Nhớ ôi Tây Tiến cơm lên khói
Mai Châu mùa em thơm nếp xôi.

* * *

Doanh trại bừng lên hội đuốc hoa
Kìa em xiêm áo tự bao giờ
Khèn lên man điệu nàng e ấp
Nhạc về Viên Chăn xây hồn thơ

Người đi Châu Mộc chiều sương ấy
Có thấy hồn lau nẻo bến bờ
Có nhớ dáng người trên độc mộc
Trôi dòng nước lũ hoa đong đưa.

* * *

Tây Tiến đoàn binh không mọc tóc
Quân xanh màu lá dữ oai hùm
Mắt trừng gửi mộng qua biên giới
Đêm mơ Hà Nội dáng kiều thơm

Rải rác biên cương mồ viễn xứ
Chiến trường đi chẳng tiếc đời xanh
Áo bào thay chiếu anh về đất
Sông Mã gầm lên khúc độc hành.

* * *

Tây Tiến người đi không hẹn ước
Đường lên thăm thẳm một chia phôi
Ai lên Tây Tiến mùa xuân ấy
Hồn về Sầm Nứa chẳng về xuôi.`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Nỗi nhớ và bức tranh thiên nhiên miền Tây hiểm trở, thơ mộng",
        lead: "Khổ 1 mở ra nỗi nhớ mênh mang 'chơi vơi' và chặng đường hành quân gian nan.",
        paragraphs: [
          "'Sông Mã xa rồi Tây Tiến ơi! / Nhớ về rừng núi nhớ chơi vơi': Hai chữ 'chơi vơi' gợi một nỗi nhớ không định hình, bảng lảng khắp không gian và đọng sâu trong tâm khảm.",
          "Địa hình Tây Bắc được khắc họa bằng những nét vẽ gân guốc: 'Dốc lên khúc khuỷu dốc thăm thẳm / Heo hút cồn mây súng ngửi trời'. Từ láy tượng hình và nghệ thuật nhân hóa 'súng ngửi trời' thể hiện độ cao ngất ngưởng cùng nét hóm hỉnh, lạc quan của người lính trẻ thủ đô.",
          "Nốt nhạc dịu êm của câu thơ toàn thanh bằng: 'Nhà ai Pha Luông mưa xa khơi' xua tan mệt nhọc, đem lại cảm giác bình yên thơ mộng."
        ],
        highlight: {
          title: "Bút pháp nghệ thuật:",
          text: "Sự hòa quyện tuyệt vời giữa cảm hứng lãng mạn và tinh thần hiện thực khắc nghiệt của chiến tranh."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Bức tượng đài bi tráng về người lính Tây Tiến",
        lead: "Khổ 3 tạc nên bức tượng đài bất tử về người chiến sĩ: hào hoa, kiên cường và thanh thản hiến dâng sự sống.",
        paragraphs: [
          "'Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai hùm': Hậu quả của sốt rét rừng hiểm nghèo không làm phai mờ khí phách lẫm liệt, dũng mãnh như hổ báo chốn đại ngàn.",
          "Tâm hồn người lính trẻ Hà thành vẫn hướng về cái đẹp lãng mạn: 'Đêm mơ Hà Nội dáng kiều thơm'. Giấc mơ tiếp thêm sức mạnh chiến đấu cho họ nơi rừng thiêng nước độc.",
          "'Chiến trường đi chẳng tiếc đời xanh / Áo bào thay chiếu anh về đất': Sự hy sinh được nâng lên tầm vóc thiêng liêng. Dòng Sông Mã gầm vang khúc độc hành tấu lên khúc tráng ca đưa tiễn các anh về với lòng đất mẹ."
        ],
        highlight: {
          title: "Chất Bi Tráng bất hủ:",
          text: "Nói về cái chết và đau thương mà không bi lụy, trái lại ngời sáng vẻ đẹp tráng lệ, kiêu hùng của cả một thế hệ anh hùng."
        }
      }
    ]
  },
  {
    id: "song-xuan-quynh",
    title: "Sóng",
    author: "Xuân Quỳnh",
    period: "1967 (Sáng tác tại bãi biển Diêm Điền)",
    category: "poetry",
    categoryName: "Thơ Ca Kháng Chiến",
    genre: "Thơ tình yêu tha thiết",
    rating: 9.8,
    reviews: 2900,
    readTime: "20 phút",
    progress: 95,
    isFavorite: true,
    isFeatured: false,
    badge: "Bài thơ tình bất hủ",
    coverImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#0f766e",
      c2: "#0d9488",
      accent: "#2dd4bf",
      gradient: "linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #2dd4bf 100%)",
      icon: "🌊"
    },
    summary: "Thông qua hình tượng sóng biển dạt dào, bài thơ thể hiện những trạng thái tâm lý phong phú, nỗi nhớ da diết và khát vọng tình yêu thủy chung, vĩnh cửu của người phụ nữ.",
    audioScript: "Sóng của nữ thi sĩ Xuân Quỳnh là tiếng lòng thổn thức của một trái tim phụ nữ đang yêu mãnh liệt. Những con sóng gối đầu lên nhau ngoài đại dương chính là nhịp đập của tình yêu, vượt qua mọi giới hạn không gian thời gian để hướng về bến bờ hạnh phúc đích thực.",
    sampleIntro: "Xuân Quỳnh là một trong những gương mặt thơ nữ tiêu biểu nhất của nền thơ ca Việt Nam hiện đại, người đã cống hiến cho đời những vần thơ tình nồng nàn, chân thành và đằm thắm. Ra đời năm 1967 bên bờ biển Diêm Điền, bài thơ 'Sóng' là bản tình ca tuyệt tác khám phá những cung bậc bí ẩn của trái tim người phụ nữ khi yêu.",
    fullTextSections: [
      {
        sectionTitle: "Toàn văn bài thơ Sóng — Xuân Quỳnh (Bản chuẩn SGK 9 khổ thơ)",
        content: `Dữ dội và dịu êm
Ồn ào và lặng lẽ
Sông không hiểu nổi mình
Sóng tìm ra tận bể.

Ôi con sóng ngày xưa
Và ngày sau vẫn thế
Nỗi khát vọng tình yêu
Bồi hồi trong ngực trẻ.

Trước muôn trùng sóng bể
Em nghĩ về anh, em
Em nghĩ về biển lớn
Từ nơi nào sóng lên?

Sóng bắt đầu từ gió
Gió bắt đầu từ đâu?
Em cũng không biết nữa
Khi nào ta yêu nhau.

Con sóng dưới lòng sâu
Con sóng trên mặt nước
Ôi con sóng nhớ bờ
Ngày đêm không ngủ được
Lòng em nhớ đến anh
Cả trong mơ còn thức.

Dẫu xuôi về phương bắc
Dẫu ngược về phương nam
Nơi nào em cũng nghĩ
Hướng về anh - một phương.

Ở ngoài kia đại dương
Trăm ngàn con sóng đó
Con nào chẳng tới bờ
Dù muôn vời cách trở.

Cuộc đời tuy dài thế
Năm tháng vẫn đi qua
Như biển kia dẫu rộng
Mây vẫn bay về xa.

Làm sao được tan ra
Thành trăm con sóng nhỏ
Giữa biển lớn tình yêu
Để ngàn năm còn vỗ.`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Những trạng thái đối cực của sóng và bản chất tình yêu",
        lead: "Khổ 1 & 2: Sóng khám phá đại dương như trái tim tìm kiếm bến đỗ đích thực.",
        paragraphs: [
          "'Dữ dội và dịu êm / Ồn ào và lặng lẽ': Bốn tính từ đối lập mở ra trạng thái tâm lý phức tạp của người phụ nữ khi yêu, vừa cuồng nhiệt mãnh liệt, vừa dịu dàng kín đáo.",
          "Hành trình 'Sông không hiểu nổi mình / Sóng tìm ra tận bể' khẳng định khát vọng vươn thoát khỏi sự chật hẹp, tầm thường để đến với không gian bao la, thấu hiểu đích thực.",
          "Khát vọng tình yêu là quy luật muôn thuở: từ 'ngày xưa' đến 'ngày sau vẫn thế', luôn làm 'bồi hồi trong ngực trẻ'."
        ],
        highlight: {
          title: "Cặp hình tượng sóng đôi:",
          text: "Sóng và Em soi chiếu vào nhau, sóng là ẩn dụ nghệ thuật hoàn hảo cho những xao xuyến tâm hồn người phụ nữ."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Nỗi nhớ da diết và tấm lòng thủy chung son sắt",
        lead: "Khổ 5 & 6: Đỉnh cao cảm xúc với nỗi nhớ xuyên không gian thời gian và hướng về một phương duy nhất.",
        paragraphs: [
          "'Con sóng dưới lòng sâu / Con sóng trên mặt nước': Sóng nhớ bờ ngày đêm không ngủ được, cũng như lòng em nhớ anh lan tỏa cả vào tiềm thức 'cả trong mơ còn thức'.",
          "Dù cuộc đời lắm trắc trở 'ngược về phương nam / xuôi về phương bắc', người phụ nữ vẫn giữ trọn một niềm tin kiên định: 'Hướng về anh - một phương'. Đó là phương của tình yêu đích thực."
        ],
        highlight: {
          title: "Vẻ đẹp tình yêu hiện đại:",
          text: "Một tình yêu vừa gìn giữ nét thủy chung truyền thống, vừa mạnh mẽ, chủ động bộc lộ khát khao gắn kết trọn đời."
        }
      }
    ]
  },
  {
    id: "dat-nuoc",
    title: "Đất Nước (Trích 'Mặt Đường Khát Vọng')",
    author: "Nguyễn Khoa Điềm",
    period: "1971 (Chiến khu Trị - Thiên)",
    category: "poetry",
    categoryName: "Thơ Ca Kháng Chiến",
    genre: "Trường ca chính luận trữ tình",
    rating: 9.9,
    reviews: 2450,
    readTime: "30 phút",
    progress: 80,
    isFavorite: true,
    isFeatured: false,
    badge: "Đất Nước của Nhân Dân",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#831843",
      c2: "#be185d",
      accent: "#f43f5e",
      gradient: "linear-gradient(135deg, #500724 0%, #9d174d 60%, #f43f5e 100%)",
      icon: "🇻🇳"
    },
    summary: "Định nghĩa mới mẻ, gần gũi và sâu sắc về Đất Nước được cảm nhận qua nhiều bình diện: lịch sử, địa lý, văn hóa phong tục dân gian, khẳng định tư tưởng cốt lõi: 'Đất Nước của Nhân Dân'.",
    audioScript: "Đoạn trích Đất Nước trích trường ca Mặt đường khát vọng của Nguyễn Khoa Điềm là khúc ca hào sảng thức tỉnh tuổi trẻ đô thị miền Nam vùng lên đấu tranh. Đất Nước không ở đâu xa lạ mà kết tinh trong từng hạt gạo, miếng trầu, câu chuyện cổ tích và mồ hôi của những con người bình dị vô danh.",
    sampleIntro: "Nếu như các nhà thơ cùng thời thường chiêm ngưỡng Đất Nước qua tầm vóc kỳ vĩ, tráng lệ thì Nguyễn Khoa Điềm lại tìm về với cội nguồn văn hóa dân gian bình dị để cảm nhận một Đất Nước vừa thiêng liêng, vừa gần gũi như máu thịt. 'Đất Nước của Nhân Dân' chính là tư tưởng thẩm mỹ cao đẹp nhất kết tinh trong trường ca 'Mặt đường khát vọng'.",
    fullTextSections: [
      {
        sectionTitle: "Đoạn 1: Cội nguồn Đất Nước bình dị và sự gắn bó máu thịt",
        content: `Khi ta lớn lên Đất Nước đã có rồi
Đất Nước có trong những cái "ngày xửa ngày xưa..." mẹ thường hay kể.
Đất Nước bắt đầu với miếng trầu bây giờ bà ăn
Đất Nước lớn lên khi dân mình biết trồng tre mà đánh giặc
Tóc mẹ thì bới sau đầu
Cha mẹ thương nhau bằng gừng cay muối mặn
Cái kèo, cái cột thành tên
Hạt gạo phải một nắng hai sương xay, giã, dần, sàng
Đất Nước có từ ngày đó...

Đất là nơi anh đến trường
Nước là nơi em tắm
Đất Nước là nơi ta hò hẹn
Đất Nước là nơi em đánh rơi chiếc khăn trong nỗi nhớ thầm
Đất là nơi "con chim phượng hoàng bay về hòn núi bạc"
Nước là nơi "con cá ngư ông móng nước biển khơi"
Thời gian đằng đẵng
Không gian mênh mông
Đất Nước là nơi dân mình đoàn tụ
Đất là nơi Chim về
Nước là nơi Rồng ở
Lạc Long Quân và Âu Cơ
Đẻ ra đồng bào ta trong bọc trứng...

Trong anh và em hôm nay
Đều có một phần Đất Nước
Khi hai đứa cầm tay
Đất Nước trong chúng mình hài hòa nồng thắm
Khi chúng ta cầm tay mọi người
Đất Nước vẹn tròn, to lớn
Mai này con ta lớn lên
Con sẽ mang Đất Nước đi xa
Đến những tháng ngày mơ mộng
Em ơi em Đất Nước là máu xương của mình
Phải biết gắn bó và san sẻ
Phải biết hóa thân cho dáng hình xứ sở
Làm nên Đất Nước muôn đời...`
      },
      {
        sectionTitle: "Đoạn 2: Không gian địa lý và tư tưởng 'Đất Nước của Nhân Dân'",
        content: `Những người vợ nhớ chồng còn góp cho Đất Nước những núi Vọng Phu
Cặp vợ chồng yêu nhau góp nên hòn Trống Mái
Gót ngựa của Phù Đổng cháu con góp cho Đất Nước một trăm ao đầm
Người học trò nghèo góp cho Đất Nước mình núi Bút non Nghiên.
Con cóc, con gà quê hương cùng góp cho Đất Nước những cảnh chùa chiền
Những người dân nào đã góp tên Ông Đốc, Ông Trang, Bà Đen, Bà Điểm...
Và ở đâu trên khắp ruộng đồng gò bãi
Chẳng mang một dáng hình, một ao ước, một lối sống ông cha
Gót chân dẫm lên đất đai này của ta
Họ đã sống và chết
Giản dị và bình tâm
Không ai nhớ mặt đặt tên
Nhưng họ đã làm ra Đất Nước.

Họ giữ và truyền cho ta hạt lúa ta trồng
Họ chuyền lửa qua mỗi nhà, từ giàn bếp qua giàn bếp
Họ truyền giọng nói cho con mình tập nói
Họ gánh theo tên xã, tên làng trong mỗi chuyến di dân
Họ đắp đập be bờ cho người sau trồng cây hái trái
Có ngoại xâm thì chống ngoại xâm
Có nội thù thì vùng lên đánh bại
Để Đất Nước này là Đất Nước Nhuận nhân
Đất Nước của Nhân Dân, Đất Nước của ca dao thần thoại
Dạy anh biết "yêu em từ thuở trong nôi"
Biết quý công cầm vàng những ngày lặn lội
Biết trồng tre đợi ngày thành gậy
Đi trả thù mà không sợ dài lâu.`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Đất Nước hình thành từ những điều bình dị, thân thương",
        lead: "Đất Nước gắn liền với văn hóa phong tục, ca dao cổ tích và sinh hoạt đời thường.",
        paragraphs: [
          "Mở đầu bằng câu khẳng định tự nhiên: 'Khi ta lớn lên Đất Nước đã có rồi'. Đất Nước bắt đầu từ câu chuyện cổ tích mẹ kể, miếng trầu bà ăn, tục bới tóc của mẹ và nghĩa tình thủy chung 'gừng cay muối mặn'.",
          "Đất Nước lớn lên trong lịch sử chống ngoại xâm oanh liệt: 'khi dân mình biết trồng tre mà đánh giặc', và trong mồ hôi nhọc nhằn của người nông dân 'hạt gạo phải một nắng hai sương'."
        ],
        highlight: {
          title: "Sáng tạo nghệ thuật:",
          text: "Nguyễn Khoa Điềm đã đưa chất liệu văn hóa dân gian vào thơ một cách nhuần nhuyễn, tự nhiên như dòng máu chảy trong huyết quản."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Tư tưởng Đất Nước của Nhân Dân",
        lead: "Nhân dân làm nên không gian địa lý, dòng chảy lịch sử và linh hồn văn hóa ngàn đời.",
        paragraphs: [
          "Tất cả danh lam thắng cảnh núi Vọng Phu, hòn Trống Mái, núi Bút non Nghiên... đều do nhân dân hóa thân mà thành.",
          "Lịch sử bốn nghìn năm không chỉ là tên tuổi vua chúa tướng lĩnh, mà được tạo dựng bởi hàng triệu người bình dị vô danh: 'Họ đã sống và chết / Giản dị và bình tâm / Không ai nhớ mặt đặt tên / Nhưng họ đã làm ra Đất Nước'."
        ],
        highlight: {
          title: "Tư tưởng thời đại:",
          text: "Tư tưởng 'Đất Nước của Nhân Dân' là đóng góp lớn nhất của đoạn trích, thể hiện tầm vóc tư tưởng và trái tim yêu nước nồng nàn của thế hệ trẻ chống Mỹ."
        }
      }
    ]
  },
  {
    id: "nguoi-lai-do-song-da",
    title: "Người Lái Đò Sông Đà",
    author: "Nguyễn Tuân",
    period: "1960 (Tập tùy bút 'Sông Đà')",
    category: "prose",
    categoryName: "Truyện Ngắn & Ký",
    genre: "Tùy bút tài hoa uyên bác",
    rating: 9.7,
    reviews: 2100,
    readTime: "30 phút",
    progress: 70,
    isFavorite: false,
    isFeatured: false,
    badge: "Đỉnh cao tùy bút",
    coverImage: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#064e3b",
      c2: "#059669",
      accent: "#34d399",
      gradient: "linear-gradient(135deg, #022c22 0%, #065f46 60%, #10b981 100%)",
      icon: "🌊"
    },
    summary: "Bản trường ca hùng tráng và thơ mộng ngợi ca vẻ đẹp kỳ vĩ của thiên nhiên Tây Bắc và chất vàng mười nơi tâm hồn người lao động mới thời kỳ xây dựng chủ nghĩa xã hội.",
    audioScript: "Người Lái Đò Sông Đà là tuyệt phẩm tùy bút thể hiện phong cách nghệ thuật tài hoa, uyên bác độc nhất vô nhị của Nguyễn Tuân. Con sông Đà hiện lên như một sinh thể sống động với hai nét tính cách đối lập: vừa hung bạo ghê gớm, vừa trữ tình mộng mơ đến say đắm lòng người.",
    sampleIntro: "Giáo sư Nguyễn Đăng Mạnh từng nhận định: 'Nguyễn Tuân là nhà văn của những tính cách phi thường, những phong cảnh tuyệt mỹ'. Với 'Người lái đò Sông Đà', ngòi bút tài hoa của ông đã biến con sông Đà thành một bản hòa tấu bất hủ của thiên nhiên và tôn vinh chất vàng mười nơi tâm hồn người lao động Tây Bắc.",
    fullTextSections: [
      {
        sectionTitle: "Phần I: Sông Đà hung bạo ghê gớm và thạch trận hiểm ác",
        content: `Hùng vĩ của Sông Đà không phải chỉ có thác đá. Mà nó còn là những cảnh đá bờ sông dựng vách thành, mặt sông chỗ ấy chỉ lúc đúng ngọ mới có mặt trời. Có vách đá chẹt lòng Sông Đà như một cái yết hầu. Đứng bên này bờ nhẹ tay ném hòn đá qua bên kia vách. Có quãng con nai con hổ đã có lần vọt từ bờ này sang bờ kia. Ngồi trong khoang đò qua quãng ấy, đang mùa hè mà cũng thấy lạnh, cảm thấy mình như đứng ở hè một cái ngõ mà ngóng vọng lên một khung cửa sổ nào trên cái tầng nhà thứ mấy nào vừa tắt phụt đèn điện.

Lại như quãng mặt ghềnh Hát Loóng, dài hàng cây số nước xô đá, đá xô sóng, sóng xô gió, cuồn cuộn luồng gió gùn ghè suốt năm như lúc nào cũng đòi nợ xuýt bất cứ người lái đò sông Đà nào tóm được qua đấy.

Ở quãng Tà Mường Vát, có những cái hút nước giống như cái giếng bê tông thả xuống sông để chuẩn bị làm móng cầu. Nước ở đây thở và vật bã như cái cống sặc xả rác. Trên mặt cái hút xoáy tít đáy, cũng đang quay lừ lừ những cánh quạ mù quáng. Không thuyền nào dám men gần những cái hút nước ấy, thuyền nào qua cũng chèo nhanh để vượt qua cái quãng hút nước, như thuyền nào bị hút nước lôi tuột xuống đáy thì tan xác ở dưới bùn...`
      },
      {
        sectionTitle: "Phần II: Sông Đà trữ tình và người lái đò vượt thác",
        content: `Tôi có bay tạt ngang qua Sông Đà mấy lần, và thấy Sông Đà như một cái dây thừng ngoằn ngoèo dưới chân mình. Nhưng nhìn kỹ thì thấy con Sông Đà tuôn dài tuôn dài như một áng tóc trữ tình, đầu tóc chân tóc ẩn hiện trong mây trời Tây Bắc bung nở hoa ban hoa gạo tháng hai và cuồn cuộn mù khói núi Mèo đốt nương xuân.

Mùa xuân dòng xanh ngọc bích, chứ Sông Đà không xanh màu xanh canh hến của Sông Gâm Sông Lô. Mùa thu nước Sông Đà lừ lừ chín đỏ như da mặt một người bầm đi vì rượu bữa, lừ lừ cái màu đỏ giận dữ của một người bất mãn bực bội gì mỗi độ thu về...

Thuyền chúng tôi xông thẳng vào ba trùng vi thạch trận. Ông lái đò hai tay giữ chặt mái chèo, mắt ngó tinh tường như một vị tướng lão luyện chỉ huy trận mạc. Cửa tử bày la liệt, sóng nước xô đẩy đè sấn lấy lòng đò. Nhưng ông đò đã thuộc binh pháp của thần sông thần đá, ung dung cưỡi lên thác ghềnh như cưỡi lên lưng hổ, phóng thẳng đò qua cửa sinh hiểm hóc giữa tiếng gầm thét bất lực của dòng thác.`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Vẻ đẹp hung bạo, dữ dằn của dòng sông Đà",
        lead: "Nguyễn Tuân huy động vốn từ phong phú của quân sự, võ thuật, điện ảnh để miêu tả dòng thác.",
        paragraphs: [
          "Vách đá dựng đứng chẹt lòng sông như 'cái yết hầu', ghềnh Hát Loóng 'nước xô đá, đá xô sóng, sóng xô gió', những cái hút nước xoáy tít sâu hoắm như giếng bê tông.",
          "Thạch trận hiểm độc với ba trùng vi bủa vây, cửa tử giăng khắp nơi hòng nuốt chửng con đò."
        ],
        highlight: {
          title: "Nghệ thuật bậc thầy:",
          text: "Thiên nhiên được nhân hóa như một loài thủy quái hung hãn, kỳ vĩ, thử thách bản lĩnh con người."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Hình tượng người lái đò tài hoa nghệ sĩ",
        lead: "Chất vàng mười tâm hồn của người lao động bình dị trong công cuộc kiến thiết đất nước.",
        paragraphs: [
          "Ông lái đò không có phép thần thông nhưng có kinh nghiệm sông nước dày dạn, trí dũng song toàn.",
          "Ông cưỡi lên thác ghềnh như một vị tướng điều binh khiển tướng, biến cuộc chiến sinh tử thành một nghệ thuật chèo đò điêu luyện."
        ],
        highlight: {
          title: "Quan niệm người anh hùng mới:",
          text: "Người anh hùng của Nguyễn Tuân hiện diện ngay trong cuộc sống lao động thầm lặng, bình dị mỗi ngày."
        }
      }
    ]
  },
  {
    id: "chiec-thuyen-ngoai-xa",
    title: "Chiếc Thuyền Ngoài Xa",
    author: "Nguyễn Minh Châu",
    period: "1983 (Giai đoạn đổi mới văn học)",
    category: "prose",
    categoryName: "Truyện Ngắn & Ký",
    genre: "Truyện ngắn triết lý",
    rating: 9.8,
    reviews: 2600,
    readTime: "25 phút",
    progress: 95,
    isFavorite: true,
    isFeatured: false,
    badge: "Triết lý nhân sinh",
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    theme: {
      c1: "#1e293b",
      c2: "#334155",
      accent: "#94a3b8",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #475569 100%)",
      icon: "⛵"
    },
    summary: "Nghịch lý đau xót giữa vẻ đẹp toàn bích của nghệ thuật nhìn từ xa và hiện thực gai góc, nhọc nhằn của cuộc sống đời thường; bài học về cái nhìn đa diện, thấu hiểu con người.",
    audioScript: "Chiếc Thuyền Ngoài Xa của Nguyễn Minh Châu đặt ra câu hỏi muôn thuở về mối quan hệ giữa nghệ thuật và cuộc đời. Nghệ thuật chân chính không được quay lưng lại với nỗi đau của con người, và người nghệ sĩ phải có cái nhìn sâu sắc, thấu cảm trước những nghịch lý nhân sinh.",
    sampleIntro: "Nguyễn Minh Châu được đánh giá là một trong những 'người mở đường tinh anh và tài hoa nhất' của văn học Việt Nam thời kỳ đổi mới. Với 'Chiếc thuyền ngoài xa', ông đặt ra những vấn đề nhức nhối về mối quan hệ giữa nghệ thuật và đời sống, giữa cái nhìn bề mặt lãng mạn và bề sâu hiện thực đa diện.",
    fullTextSections: [
      {
        sectionTitle: "Phần I: Hai phát hiện nghịch lý của nghệ sĩ Phùng",
        content: `Tôi phục kích suốt mấy ngày liền mới chớp được một cảnh đắt trời cho. Trước mắt tôi là một bức tranh mực tàu của một danh họa thời cổ. Mũi thuyền in một nét mơ hồ lòe nhòe vào bầu sương mù màu trắng sữa có pha đôi chút màu hồng hồng do ánh mặt trời chiếu vào. Vài bóng người lớn lẫn trẻ con ngồi im phăng phắc như tượng trên chiếc mui khum khum, đang hướng mặt vào bờ. Tất cả khung cảnh ấy nhìn qua những cái mắt lưới và tấm lưới nằm giữa hai chiếc gọng vó hiện ra dưới một hình thù y hệt cánh một con dơi, toàn bộ khung cảnh từ đường nét đến ánh sáng đều hài hòa và đẹp, một vẻ đẹp thực đơn giản và toàn bích khiến đứng trước nó tôi trở nên bối rối, trong trái tim như có cái gì bóp thắt vào.

Thế nhưng ngay sau khi con thuyền cập bờ, từ trong khoang thuyền bước ra một người đàn bà trạc ngoài bốn mươi tuổi, mặt rỗ, thân hình thô kệch, và một người đàn ông lực lưỡng với đôi mắt dữ dội. Người đàn ông lập tức rút chiếc thắt lưng da quất tới tấp vào lưng người đàn bà, vừa đánh vừa thở hồng hộc, vừa nghiến răng chửi rủa: "Mày chết đi cho ông nhờ, chúng mày chết hết đi cho ông nhờ!". Người đàn bà nhẫn nhục đứng im, không hề trốn chạy cũng không một tiếng van xin.

Chứng kiến cảnh tượng bạo lực tàn bạo ấy, tâm hồn nghệ sĩ của Phùng chết lặng. Chiếc thuyền nghệ thuật thơ mộng ngoài xa đã tan vỡ trước hiện thực nhức nhối của cuộc đời.`
      },
      {
        sectionTitle: "Phần II: Câu chuyện ở tòa án huyện và bức ảnh lịch",
        content: `Ở tòa án huyện, Chánh án Đẩu - người bạn chiến đấu năm xưa của Phùng - khuyên người đàn bà bỏ chồng để giải thoát bản thân. Người đàn bà chắp tay lạy van: "Quý tòa bắt tội con cũng được, phạt tù con cũng được, đừng bắt con bỏ nó...".

Bà trải lòng câu chuyện thật xót xa: cần một người đàn ông khỏe mạnh để chèo chống con thuyền lúc biển động sóng to, nuôi sống một đàn con trên dưới mười đứa. "Vui nhất là những lúc chúng nó được ăn no...", bà nói với nụ cười héo hắt.

Cả Đẩu và Phùng đều vỡ lẽ: lòng tốt nếu thiếu sự thấu hiểu thực tế thì chỉ là lý thuyết ngây thơ. Mỗi lần nhìn vào bức ảnh lịch đen trắng, Phùng luôn thấy hiện lên màu hồng hồng của ánh sương mai và hình ảnh người đàn bà bước ra với đôi chân trần ướt sũng...`
      }
    ],
    chapters: [
      {
        id: "chap-1",
        title: "Luận điểm 1: Hai phát hiện của người nghệ sĩ nhiếp ảnh",
        lead: "Đối lập gay gắt giữa cái đẹp tuyệt đỉnh của nghệ thuật và nỗi đau bạo lực đời thực.",
        paragraphs: [
          "Phát hiện 1: Chiếc thuyền trong sương sớm đẹp như bức tranh mực tàu của danh họa thời cổ, mang lại cảm xúc thanh lọc tâm hồn.",
          "Phát hiện 2: Người chồng vũ phu đánh vợ tàn bạo bằng thắt lưng da, phơi bày hiện thực đói nghèo, tăm tối sau chiến tranh."
        ],
        highlight: {
          title: "Triết lý nhân sinh:",
          text: "Nghệ thuật không được xa rời cuộc đời; người nghệ sĩ phải dấn thân thấu hiểu nỗi đau con người."
        }
      },
      {
        id: "chap-2",
        title: "Luận điểm 2: Câu chuyện ở tòa án huyện và chiều sâu số phận",
        lead: "Lời giải thích của người đàn bà hàng chài làm thức tỉnh Chánh án Đẩu và Phùng.",
        paragraphs: [
          "Lời từ chối bỏ chồng bắt nguồn từ tình mẫu tử thiêng liêng và gánh nặng sinh tồn mưu sinh ngoài biển khơi.",
          "Bài học về cái nhìn đa diện, nhiều chiều: không thể đánh giá con người qua vẻ bề ngoài đơn giản một chiều."
        ],
        highlight: {
          title: "Thông điệp thời đại:",
          text: "Cần nhìn nhận con người trong tính đa đoan, phức tạp của đời sống và tìm giải pháp căn cơ từ thực tiễn."
        }
      }
    ]
  }
];

const LITERARY_QUOTES = [
  {
    quote: "Văn học thực chất là nhân học. Văn học giúp con người hiểu được bản thân mình, nâng cao niềm tin vào chính mình và làm nảy nở ở con người khát vọng hướng tới chân lý.",
    author: "Maxim Gorky",
    context: "Lý luận về chức năng nhân đạo hóa của văn chương"
  },
  {
    quote: "Một tác phẩm nghệ thuật chân chính phải vượt lên trên những bờ cõi và giới hạn, phải là một tác phẩm chung cho cả loài người. Nó phải chứa đựng được một cái gì lớn lao, mạnh mẽ, vừa đau đớn lại vừa phấn khởi.",
    author: "Nam Cao ('Đời thừa')",
    context: "Sứ mệnh và tiêu chuẩn của tác phẩm văn chương đỉnh cao"
  },
  {
    quote: "Nghệ thuật không cần phải là ánh trăng lừa dối, nghệ thuật không nên là ánh trăng lừa dối; nghệ thuật có thể chỉ là tiếng đau khổ kia, thoát ra từ những kiếp lầm than.",
    author: "Nam Cao ('Giăng sáng')",
    context: "Quan điểm văn học hiện thực vị nhân sinh sâu sắc"
  },
  {
    quote: "Thơ chỉ trào ra khi trong tim ta cuộc sống đã thật đầy.",
    author: "Tố Hữu",
    context: "Cội nguồn cảm xúc và bản chất trữ tình của thi ca"
  },
  {
    quote: "Văn học nằm ngoài những định luật của sự băng hoại. Chỉ mình nó không thừa nhận cái chết.",
    author: "Saltykov Shchedrin",
    context: "Sức sống vĩnh cửu bất diệt của văn chương nghệ thuật chân chính"
  },
  {
    quote: "Cái đẹp cứu rỗi thế giới.",
    author: "Fyodor Dostoevsky",
    context: "Sức mạnh thanh lọc và cảm hóa tâm hồn con người của cái đẹp"
  }
];

const SAMPLE_STUDENT_NOTES = [
  {
    id: "note-1",
    workId: "vo-chong-a-phu",
    workTitle: "Vợ Chồng A Phủ (Tô Hoài)",
    content: "Dẫn chứng vàng tiếng sáo: 'Tiếng sáo lơ lửng bay ngoài đường', 'Tiếng sáo gọi bạn yêu vẫn lửng lơ bay ngoài đường'. Tiếng sáo là biểu tượng của tình yêu, tự do và là ngòi nổ đánh thức sức sống tiềm tàng của Mị.",
    tag: "#DanChungVang",
    date: "10/10/2026"
  },
  {
    id: "note-2",
    workId: "vo-nhat",
    workTitle: "Vợ Nhặt (Kim Lân)",
    content: "Mở bài so sánh: Đặt cạnh 'Một bữa no' của Nam Cao để thấy Kim Lân không hướng ngòi bút về sự tha hóa bần cùng, mà nâng niu ngọn lửa khát vọng sống và tình người ấm áp giữa cõi chết đói.",
    tag: "#MoBaiNangCao",
    date: "09/10/2026"
  },
  {
    id: "note-3",
    workId: "tay-tien",
    workTitle: "Tây Tiến (Quang Dũng)",
    content: "Dẫn chứng bi tráng: 'Rải rác biên cương mồ viễn xứ / Chiến trường đi chẳng tiếc đời xanh / Áo bào thay chiếu anh về đất / Sông Mã gầm lên khúc độc hành'. Sự hy sinh thanh thản hóa thành bất tử.",
    tag: "#LuanDiemSau",
    date: "08/10/2026"
  }
];
