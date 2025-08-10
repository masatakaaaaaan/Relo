import React, { useState, useEffect } from 'react';
import { User, Crown, Gift, Calendar, ShoppingCart, Mail, QrCode, Settings, Users, Package, TrendingUp, Star, Clock, Heart, Award, Lock, Upload, Camera, Plus, X, Eye, EyeOff } from 'lucide-react';

const BeautySalonApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // サンプルデータ
  const [customers] = useState([
    { id: 1, name: '佐藤花子', email: 'hanako@email.com', phone: '090-1234-5678', totalSpent: 85000, rank: 'gold', visits: 12, qrCode: 'QR001', password: 'customer123' },
    { id: 2, name: '田中美香', email: 'mika@email.com', phone: '090-2345-6789', totalSpent: 42000, rank: 'silver', visits: 6, qrCode: 'QR002', password: 'customer123' },
    { id: 3, name: '鈴木愛', email: 'ai@email.com', phone: '090-3456-7890', totalSpent: 18000, rank: 'bronze', visits: 3, qrCode: 'QR003', password: 'customer123' }
  ]);

  const [treatments] = useState([
    { id: 1, customerId: 1, date: '2024-08-01', service: 'カラー + カット', price: 8500, stylist: '山田', notes: '根元カラー、トーンダウン希望', images: ['https://via.placeholder.com/300x200?text=Before', 'https://via.placeholder.com/300x200?text=After'] },
    { id: 2, customerId: 1, date: '2024-07-15', service: 'トリートメント + カット', price: 7200, stylist: '佐々木', notes: 'ダメージケア重点', images: ['https://via.placeholder.com/300x200?text=Treatment'] },
    { id: 3, customerId: 1, date: '2024-06-28', service: 'パーマ + カット', price: 12800, stylist: '山田', notes: 'ゆるふわパーマ', images: [] }
  ]);

  const [coupons] = useState([
    { id: 1, name: '10%割引クーポン', discount: 10, minSpend: 5000, validUntil: '2024-09-30', forRank: 'bronze' },
    { id: 2, name: '15%割引クーポン', discount: 15, minSpend: 8000, validUntil: '2024-09-30', forRank: 'silver' },
    { id: 3, name: '20%割引クーポン', discount: 20, minSpend: 10000, validUntil: '2024-09-30', forRank: 'gold' },
    { id: 4, name: 'VIP特別割引', discount: 25, minSpend: 15000, validUntil: '2024-09-30', forRank: 'platinum' }
  ]);

  const adminCredentials = { username: 'admin', password: 'admin123' };

  // ランク計算
  const getRank = (totalSpent) => {
    if (totalSpent >= 100000) return 'platinum';
    if (totalSpent >= 50000) return 'gold';
    if (totalSpent >= 20000) return 'silver';
    return 'bronze';
  };

  const getRankColor = (rank) => {
    const colors = {
      bronze: 'text-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200',
      silver: 'text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200',
      gold: 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200',
      platinum: 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200'
    };
    return colors[rank] || colors.bronze;
  };

  const getRankIcon = (rank) => {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎'
    };
    return icons[rank] || icons.bronze;
  };

  // ログイン処理
  const handleLogin = (email, password, isAdminLogin = false) => {
    if (isAdminLogin) {
      if (email === adminCredentials.username && password === adminCredentials.password) {
        setIsAdmin(true);
        setIsLoggedIn(true);
        setActiveTab('customers');
        return true;
      }
    } else {
      const customer = customers.find(c => c.email === email && c.password === password);
      if (customer) {
        setCurrentUser(customer);
        setIsAdmin(false);
        setIsLoggedIn(true);
        setActiveTab('profile');
        return true;
      }
    }
    return false;
  };

  // ログアウト処理
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsLoggedIn(false);
    setActiveTab('profile');
  };

  // ログイン画面
  const LoginScreen = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginType, setLoginType] = useState('customer');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      const success = handleLogin(loginData.email, loginData.password, loginType === 'admin');
      if (!success) {
        setError('ログイン情報が正しくありません');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-slate-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full">
                  <Crown className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                PREMIUM SALON
              </h1>
              <p className="text-slate-600 text-sm">エレガンスとラグジュアリーの融合</p>
            </div>

            <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLoginType('customer')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === 'customer'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                顧客ログイン
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === 'admin'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                管理者ログイン
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {loginType === 'admin' ? 'ユーザー名' : 'メールアドレス'}
                </label>
                <input
                  type={loginType === 'admin' ? 'text' : 'email'}
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all bg-white"
                  placeholder={loginType === 'admin' ? 'admin' : 'your@email.com'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">パスワード</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all bg-white"
                    placeholder="パスワードを入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
              )}
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  loginType === 'customer'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-900'
                    : 'bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-900'
                }`}
              >
                ログイン
              </button>
            </form>

            {loginType === 'customer' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowRegistration(true)}
                  className="text-slate-600 hover:text-slate-800 font-medium"
                >
                  新規会員登録
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
              <p className="mb-2 font-medium">デモ用アカウント:</p>
              {loginType === 'customer' ? (
                <p>Email: hanako@email.com / Password: customer123</p>
              ) : (
                <p>Username: admin / Password: admin123</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 顧客登録画面
  const RegistrationScreen = () => {
    const [regData, setRegData] = useState({
      name: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleRegister = (e) => {
      e.preventDefault();
      if (regData.password !== regData.confirmPassword) {
        setError('パスワードが一致しません');
        return;
      }
      setShowRegistration(false);
      alert('会員登録が完了しました！');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full">
                  <Crown className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">新規会員登録</h1>
              <p className="text-slate-600 text-sm">プレミアムメンバーになりませんか？</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">お名前</label>
                <input
                  type="text"
                  value={regData.name}
                  onChange={(e) => setRegData({...regData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={regData.email}
                  onChange={(e) => setRegData({...regData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">電話番号</label>
                <input
                  type="tel"
                  value={regData.phone}
                  onChange={(e) => setRegData({...regData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">パスワード</label>
                <input
                  type="password"
                  value={regData.password}
                  onChange={(e) => setRegData({...regData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">パスワード確認</label>
                <input
                  type="password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105 shadow-lg"
              >
                会員登録
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowRegistration(false)}
                className="text-slate-600 hover:text-slate-800"
              >
                ← ログイン画面に戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // クーポン作成フォーム
  const CouponForm = () => {
    const [couponData, setCouponData] = useState({
      name: '', discount: '', minSpend: '', validUntil: '', forRank: 'bronze'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      alert('クーポンが作成されました！');
      setShowCouponForm(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">新規クーポン作成</h3>
            <button
              onClick={() => setShowCouponForm(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">クーポン名</label>
              <input
                type="text"
                value={couponData.name}
                onChange={(e) => setCouponData({...couponData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white"
                placeholder="例: 春の特別割引"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">割引率(%)</label>
              <input
                type="number"
                value={couponData.discount}
                onChange={(e) => setCouponData({...couponData, discount: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white"
                placeholder="10"
                min="1" max="50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">最低利用金額</label>
              <input
                type="number"
                value={couponData.minSpend}
                onChange={(e) => setCouponData({...couponData, minSpend: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white"
                placeholder="5000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">対象ランク</label>
              <select
                value={couponData.forRank}
                onChange={(e) => setCouponData({...couponData, forRank: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white"
              >
                <option value="bronze">ブロンズ</option>
                <option value="silver">シルバー</option>
                <option value="gold">ゴールド</option>
                <option value="platinum">プラチナ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">有効期限</label>
              <input
                type="date"
                value={couponData.validUntil}
                onChange={(e) => setCouponData({...couponData, validUntil: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white"
                required
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCouponForm(false)}
                className="flex-1 py-3 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all"
              >
                作成
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 顧客向けダッシュボード
  const CustomerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}様</h2>
              <p className="text-slate-300">いつもご利用ありがとうございます</p>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-full ${getRankColor(currentUser.rank)} shadow-lg`}>
            <span className="font-bold text-lg">{getRankIcon(currentUser.rank)} {currentUser.rank.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">¥{currentUser.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-slate-300">累計利用金額</div>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">{treatments.filter(t => t.customerId === currentUser.id).length}回</div>
            <div className="text-sm text-slate-300">ご来店回数</div>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">{coupons.filter(c => c.forRank === currentUser.rank).length}枚</div>
            <div className="text-sm text-slate-300">利用可能クーポン</div>
          </div>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-slate-600" />
              プロフィール情報
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-sm font-medium text-slate-600">お名前</label>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{currentUser.name}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-sm font-medium text-slate-600">会員ランク</label>
                  <div className="mt-2">
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getRankColor(currentUser.rank)} shadow-sm`}>
                      {getRankIcon(currentUser.rank)} {currentUser.rank.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-slate-600" />
                マイQRコード
              </h4>
              <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 bg-white border-4 border-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
                    <QrCode className="w-24 h-24 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600 mb-2">会計時にこのQRコードを提示してください</div>
                  <div className="text-sm font-mono text-slate-800 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    {currentUser.qrCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-slate-600" />
              施術履歴
            </h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {treatments.filter(t => t.customerId === currentUser.id).map(treatment => (
                <div key={treatment.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-slate-900">{treatment.service}</div>
                      <div className="text-sm text-slate-600">担当: {treatment.stylist}様</div>
                      {treatment.notes && (
                        <div className="text-sm text-slate-500 mt-1">{treatment.notes}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">¥{treatment.price.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">{treatment.date}</div>
                    </div>
                  </div>
                  {treatment.images && treatment.images.length > 0 && (
                    <div className="border-t border-slate-200 pt-3">
                      <div className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        施術写真
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {treatment.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`施術写真 ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm group-hover:shadow-md border border-slate-200"
                              onClick={() => window.open(image, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Gift className="w-6 h-6 mr-3 text-slate-600" />
            ご利用可能クーポン
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.filter(c => c.forRank === currentUser.rank).map(coupon => (
              <div key={coupon.id} className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-lg">{coupon.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {coupon.minSpend.toLocaleString()}円以上のご利用で適用
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      有効期限: {coupon.validUntil}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-4xl font-bold text-slate-700">{coupon.discount}%</div>
                    <div className="text-sm font-medium text-slate-600">OFF</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-300">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg font-medium hover:from-slate-800 hover:to-slate-900 transition-all shadow-md hover:shadow-lg">
                    クーポンを使用
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 管理者向けダッシュボード
  const AdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
              <div className="text-sm text-slate-600">総顧客数</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200">
              <TrendingUp className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">¥{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</div>
              <div className="text-sm text-slate-600">総売上</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-200">
              <Gift className="w-8 h-8 text-amber-700" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">{coupons.length}</div>
              <div className="text-sm text-slate-600">配布クーポン</div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-slate-600" />
              顧客管理
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">顧客情報</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">ランク</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">累計利用金額</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">来店回数</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">QRコード</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900">{customer.name}</div>
                          <div className="text-sm text-slate-600">{customer.email}</div>
                          <div className="text-sm text-slate-600">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRankColor(customer.rank)}`}>
                          {getRankIcon(customer.rank)} {customer.rank.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ¥{customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-900">
                        {customer.visits}回
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <QrCode className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="text-sm font-mono text-slate-900">{customer.qrCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-slate-600 hover:text-slate-800 font-medium text-sm">編集</button>
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">QR読取</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qr-reader' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <QrCode className="w-6 h-6 mr-3 text-slate-600" />
            QRコード読み取り・売上登録
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mb-8 bg-slate-50">
              <QrCode className="w-20 h-20 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 mb-4 text-lg">顧客のQRコードをスキャンしてください</p>
              <button className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-8 py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105 shadow-lg font-medium">
                <Camera className="w-5 h-5 inline mr-2" />
                カメラを起動
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">施術内容</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white" placeholder="例: カット + カラー" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">料金</label>
                <input type="number" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">担当者</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white">
                  <option>山田</option>
                  <option>佐々木</option>
                  <option>田中</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">施術写真</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 bg-white"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">メモ</label>
              <textarea className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white" rows={4} placeholder="施術に関するメモ"></textarea>
            </div>
            <button className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-900 transition-all transform hover:scale-105 shadow-lg font-medium text-lg">
              売上を登録
            </button>
          </div>
        </div>
      )}

      {activeTab === 'coupon-management' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <Gift className="w-6 h-6 mr-3 text-slate-600" />
              クーポン管理
            </h3>
            <button
              onClick={() => setShowCouponForm(true)}
              className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105 shadow-lg font-medium flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              新しいクーポンを作成
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map(coupon => (
              <div key={coupon.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all bg-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-lg">{coupon.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      対象ランク: <span className="font-medium">{coupon.forRank.toUpperCase()}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      最低利用金額: <span className="font-medium">¥{coupon.minSpend.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-2">有効期限: {coupon.validUntil}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-slate-700">{coupon.discount}%OFF</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">編集</button>
                  <button className="text-red-600 hover:text-red-800 font-medium text-sm">削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Mail className="w-6 h-6 mr-3 text-slate-600" />
            メルマガ配信
          </h3>
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">件名</label>
              <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white" placeholder="メルマガの件名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">配信対象</label>
              <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white">
                <option>全顧客</option>
                <option>ブロンズ会員</option>
                <option>シルバー会員</option>
                <option>ゴールド会員</option>
                <option>プラチナ会員</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">本文</label>
              <textarea className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white" rows="8" placeholder="メルマガの内容を入力してください"></textarea>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-lg font-medium text-lg">
              <Mail className="w-5 h-5 inline mr-2" />
              メルマガを配信
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const customerTabs = [
    { id: 'profile', label: 'マイプロフィール', icon: User },
    { id: 'coupons', label: 'クーポン', icon: Gift }
  ];

  const adminTabs = [
    { id: 'customers', label: '顧客管理', icon: Users },
    { id: 'qr-reader', label: 'QR読取・売上登録', icon: QrCode },
    { id: 'coupon-management', label: 'クーポン管理', icon: Gift },
    { id: 'newsletter', label: 'メルマガ配信', icon: Mail }
  ];

  const tabs = isAdmin ? adminTabs : customerTabs;

  if (!isLoggedIn) {
    if (showRegistration) {
      return <RegistrationScreen />;
    }
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full mr-4">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  PREMIUM SALON CRM
                </h1>
                <p className="text-sm text-slate-600">エレガンスとラグジュアリーの融合</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="text-right">
                  <div className="font-medium text-slate-900">{currentUser.name}様</div>
                  <div className="text-sm text-slate-600">
                    {isAdmin ? '管理者' : `${currentUser.rank.toUpperCase()}会員`}
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl hover:from-slate-700 hover:to-slate-900 transition-all font-medium shadow-md hover:shadow-lg"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="border-b border-slate-200 bg-white rounded-t-2xl shadow-sm">
            <div className="flex space-x-8 overflow-x-auto px-6 py-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center transition-all ${
                      activeTab === tab.id
                        ? 'border-slate-600 text-slate-800'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {isAdmin ? <AdminDashboard /> : <CustomerDashboard />}
      </div>

      {showCouponForm && <CouponForm />}
    </div>
  );
};

export default BeautySalonApp;
